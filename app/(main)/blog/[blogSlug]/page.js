import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    // Fetch all blog slugs from your API or data source
    const response = await fetch('https://api.sphinixmobile.com/blogs');
    const blogs = await response.json();

    return blogs.map((blog) => ({
        blogSlug: blog.slug,
    }));
}

export default async function BlogDetailsPage({ params }) {
    const { blogSlug } = params;

    // Fetch the specific blog post
    const response = await fetch(`https://api.sphinixmobile.com/blogs/${blogSlug}`);
    const blog = await response.json();

    // If blog not found, show 404
    if (!blog) {
        notFound();
    }

    return (
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <article>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {blog.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Published on {new Date(blog.publishedAt).toLocaleDateString()}
                </p>
                <div
                    className="prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </div>
    );
}