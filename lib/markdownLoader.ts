import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  slug: string;
  publishedDate: string;
  coverUrl?: string | null;
  coverLight?: string | null;
  coverDark?: string | null;
  coverAlt?: string | null;
  metaDescription: string;
  tags: string[];
  draft?: boolean;
  readingTime?: number; // in minutes
}

export interface Post extends PostMetadata {
  body: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

// Generate slug from filename if not provided in frontmatter
function generateSlugFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate reading time from content (words per minute)
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // At least 1 minute
}

// Validate required frontmatter fields
function validatePostData(data: any, filename: string): string[] {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== 'string') {
    errors.push(`Missing or invalid title in ${filename}`);
  }
  
  if (!data.publishedDate || typeof data.publishedDate !== 'string') {
    errors.push(`Missing or invalid publishedDate in ${filename}`);
  } else {
    // Validate date format
    const date = new Date(data.publishedDate);
    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format in publishedDate for ${filename}`);
    }
  }
  
  if (!data.metaDescription || typeof data.metaDescription !== 'string') {
    errors.push(`Missing or invalid metaDescription in ${filename}`);
  }
  
  return errors;
}

export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory does not exist: ${postsDirectory}`);
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Post file does not exist: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Validate required fields
    const validationErrors = validatePostData(data, `${slug}.md`);
    if (validationErrors.length > 0) {
      console.error('Post validation errors:', validationErrors);
      return null;
    }
    
    // Generate slug from filename if not provided
    const postSlug = data.slug || generateSlugFromFilename(slug);
    
    return {
      title: data.title,
      slug: postSlug,
      publishedDate: data.publishedDate,
      coverUrl: data.coverUrl || null,
      coverLight: data.coverLight || null,
      coverDark: data.coverDark || null,
      coverAlt: data.coverAlt || null,
      metaDescription: data.metaDescription,
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: Boolean(data.draft),
      body: content,
      readingTime: calculateReadingTime(content),
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(includeDrafts: boolean = false): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is Post => {
      if (!post) return false;
      // Filter out drafts unless explicitly requested
      if (!includeDrafts && post.draft) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by published date, newest first
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

  return posts;
}

export function getPostMetadata(includeDrafts: boolean = false): PostMetadata[] {
  return getAllPosts(includeDrafts).map(({ body, ...metadata }) => ({
    ...metadata,
    readingTime: calculateReadingTime(body),
  }));
}

// Get posts by tag
export function getPostsByTag(tag: string, includeDrafts: boolean = false): Post[] {
  return getAllPosts(includeDrafts).filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

// Get all unique tags
export function getAllTags(includeDrafts: boolean = false): string[] {
  const allTags = getAllPosts(includeDrafts)
    .flatMap(post => post.tags)
    .filter(tag => tag && tag.trim().length > 0);
  
  return Array.from(new Set(allTags)).sort();
}
