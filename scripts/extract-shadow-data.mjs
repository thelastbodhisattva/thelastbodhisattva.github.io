#!/usr/bin/env node
/**
 * extract-shadow-data.mjs
 * Reads shadow log files from the last 7 days and outputs compact JSON
 * to public/data/shadow-regime.json for the RegimeClassifier component.
 *
 * - Regime history comes from the LATEST log (it's cumulative)
 * - Crisis alerts are MERGED from ALL logs in the time window (each log
 *   only captures alerts since the last save, so merging gives full coverage)
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const SHADOW_LOGS_DIR = resolve("../shadow_logs");
const OUTPUT_DIR = resolve("public/data");
const OUTPUT_FILE = join(OUTPUT_DIR, "shadow-regime.json");
const LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function main() {
    // List and sort all log files (newest first)
    const files = await readdir(SHADOW_LOGS_DIR);
    const logFiles = files
        .filter((f) => f.startsWith("shadow_") && f.endsWith(".json"))
        .map((f) => ({
            name: f,
            ts: parseInt(f.replace("shadow_", "").replace(".json", "")),
        }))
        .sort((a, b) => b.ts - a.ts);

    if (logFiles.length === 0) {
        console.error("No shadow log files found in", SHADOW_LOGS_DIR);
        process.exit(1);
    }

    // Read the latest log for regime history + metadata
    const latestFile = logFiles[0];
    console.log(`Latest log: ${latestFile.name}`);
    const latestRaw = await readFile(
        join(SHADOW_LOGS_DIR, latestFile.name),
        "utf8"
    );
    const latest = JSON.parse(latestRaw);

    // Determine the 7-day cutoff
    const cutoff = latestFile.ts - LOOKBACK_MS;
    const recentFiles = logFiles.filter((f) => f.ts >= cutoff);
    console.log(
        `Found ${recentFiles.length} log files within the last 7 days (of ${logFiles.length} total)`
    );

    // ── Aggregate crisis alerts from all recent files ──
    const alertMap = new Map(); // key by timestamp to deduplicate

    for (const file of recentFiles) {
        try {
            const raw = await readFile(join(SHADOW_LOGS_DIR, file.name), "utf8");
            const log = JSON.parse(raw);
            for (const alert of log.crisisAlerts || []) {
                // Use timestamp as dedup key
                const key = `${alert.timestamp}-${alert.data?.price}-${alert.data?.quantity}`;
                if (!alertMap.has(key)) {
                    alertMap.set(key, alert);
                }
            }
        } catch {
            // skip malformed files
        }
    }

    // Sort alerts by timestamp, take the most recent 100
    const allAlerts = Array.from(alertMap.values()).sort(
        (a, b) => a.timestamp - b.timestamp
    );
    const crisisAlerts = allAlerts.slice(-100).map((a) => ({
        type: a.type,
        ts: a.timestamp,
        price: a.data?.price || 0,
        qty: a.data?.quantity || 0,
        usd: Math.round(a.data?.usdValue || 0),
        side: a.data?.isBuyerMaker ? "SELL" : "BUY",
    }));

    // ── Extract regime history from latest (cumulative) ──
    const regimeHistory = (latest.regimeHistory || []).map((t) => ({
        from: t.from,
        to: t.to,
        ts: t.timestamp,
        conf: Math.round(t.confidence * 100) / 100,
        indicators: (t.crisis_indicators || []).length,
        confirmations: t.confirmationReadings || 0,
    }));

    // ── Compute regime durations ──
    const regimeDurations = {};
    for (let i = 0; i < regimeHistory.length; i++) {
        const entry = regimeHistory[i];
        const nextTs =
            i < regimeHistory.length - 1 ? regimeHistory[i + 1].ts : Date.now();
        const duration = nextTs - entry.ts;
        const regime = entry.to;
        regimeDurations[regime] = (regimeDurations[regime] || 0) + duration;
    }

    // ── Build output ──
    const output = {
        currentRegime: latest.currentRegime || "UNKNOWN",
        startTime: latest.startTime,
        runtime: latest.runtime,
        classificationCount: latest.classificationCount,
        totalTransitions: regimeHistory.length,
        totalAlerts: allAlerts.length,
        regimeHistory,
        crisisAlerts,
        regimeDurations,
        extractedAt: latestFile.ts,
        logFilesProcessed: recentFiles.length,
    };

    // Write output
    await mkdir(OUTPUT_DIR, { recursive: true });
    await writeFile(OUTPUT_FILE, JSON.stringify(output));
    const sizeKB = (JSON.stringify(output).length / 1024).toFixed(1);
    console.log(`\nWritten ${OUTPUT_FILE} (${sizeKB} KB)`);
    console.log(`  Current regime: ${output.currentRegime}`);
    console.log(`  Transitions: ${output.totalTransitions}`);
    console.log(
        `  Crisis alerts: ${allAlerts.length} unique found, ${crisisAlerts.length} included`
    );
    console.log(`  Runtime: ${(output.runtime / 3600000).toFixed(1)} hours`);
    console.log(`  Files processed: ${recentFiles.length}`);
}

main().catch(console.error);
