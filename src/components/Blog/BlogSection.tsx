import { getAllPosts } from "@/lib/blog";
import BlogSectionClient from "./BlogSectionClient";

export default function BlogSection() {
    const posts = getAllPosts();
    return <BlogSectionClient posts={posts} />;
}
