import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const createBaseSchema = () => z.object({
  title: z.string(),
  description: z.string()
})

const createButtonSchema = () => z.object({
  label: z.string(),
  icon: z.string().optional(),
  to: z.string().optional(),
  color: z.enum(['primary', 'neutral', 'success', 'warning', 'error', 'info']).optional(),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).optional(),
  variant: z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link']).optional(),
  target: z.enum(['_blank', '_self']).optional()
})

const createImageSchema = () => z.object({
  src: z.string().editor({ input: 'media' }),
  alt: z.string()
})

const createSeoSchema = () => z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional()
})

const createAuthorSchema = () => z.object({
  name: z.string(),
  description: z.string().optional(),
  username: z.string().optional(),
  twitter: z.string().optional(),
  bluesky: z.string().optional(),
  spotify: z.string().optional(),
  to: z.string().optional(),
  avatar: createImageSchema().optional()
})

const createTestimonialSchema = () => z.object({
  quote: z.string(),
  author: createAuthorSchema()
})

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: 'page',
      source: 'index.yml',
      schema: z.object({
        seo: createSeoSchema().optional(),
        hero: z.object({
          links: z.array(createButtonSchema()),
          images: z.array(createImageSchema())
        }),
        about: createBaseSchema(),
        experience: createBaseSchema().extend({
          items: z.array(z.object({
            date: z.string(),
            position: z.string(),
            location: z.string().optional(),
            summary: z.string().optional(),
            company: z.object({
              name: z.string(),
              url: z.string().optional(),
              logo: z.string().editor({ input: 'icon' }),
              color: z.string()
            })
          }))
        }),
        testimonials: z.array(createTestimonialSchema()),
        blog: createBaseSchema(),
        faq: createBaseSchema().extend({
          categories: z.array(
            z.object({
              title: z.string().nonempty(),
              questions: z.array(
                z.object({
                  label: z.string().nonempty(),
                  content: z.string().nonempty()
                })
              )
            }))
        })
      })
    }),
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: z.object({
        title: z.string().nonempty(),
        slug: z.string().nonempty(),
        order: z.number().optional(),
        category: z.string().optional(),
        description: z.string().nonempty(),
        draft: z.boolean().optional(),
        cover: z.string().optional(),
        image: z.string().nonempty().editor({ input: 'media' }),
        link: z.string().optional(),
        url: z.string().nonempty(),
        icon: z.string().optional(),
        logo: z.string().optional(),
        stars: z.string().optional(),
        ongoing: z.boolean().optional(),
        tags: z.array(z.string()),
        date: z.date(),
        seo: createSeoSchema().optional()
      })
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        minRead: z.number(),
        date: z.date(),
        image: z.string().nonempty().editor({ input: 'media' }).optional(),
        author: createAuthorSchema(),
        seo: createSeoSchema().optional()
      })
    }),
    pages: defineCollection({
      type: 'page',
      source: [
        { include: 'projects.yml' },
        { include: 'blog.yml' }
      ],
      schema: z.object({
        links: z.array(createButtonSchema()),
        seo: createSeoSchema().optional()
      })
    }),
    speaking: defineCollection({
      type: 'page',
      source: 'speaking.yml',
      schema: z.object({
        links: z.array(createButtonSchema()),
        seo: createSeoSchema().optional(),
        events: z.array(z.object({
          category: z.enum(['Live talk', 'Podcast', 'Conference']),
          title: z.string(),
          date: z.date(),
          location: z.string(),
          url: z.string().optional()
        }))
      })
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.yml',
      schema: z.object({
        content: z.object({}),
        images: z.array(createImageSchema()),
        seo: createSeoSchema().optional()
      })
    })
  }
})
