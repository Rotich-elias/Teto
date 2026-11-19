import Image from 'next/image';
import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { Todo } from '@/components/todo';
import { getProducts } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Products | Teto Technologies',
  description: 'Apps and web products from Teto Technologies — download our apps and explore live websites.',
  path: '/products',
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Apps and products we've built."
        lead="Download our mobile apps or visit live websites. New releases and links will be added here."
      />

      <div className="container-page py-14 sm:py-16">
        {products.length === 0 ? (
          <div className="card border-dashed p-8 text-center">
            <p className="text-sm font-semibold text-ink">No products listed yet.</p>
            <p className="mt-2 text-sm text-ink-soft">
              Add products from the <a href="/admin/products" className="font-semibold text-primary-700 underline dark:text-primary-300">admin area</a>.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <article key={index} className="card flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name ? `${product.name} product image` : 'Product image placeholder'}
                      width={1200}
                      height={750}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-raised/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted shadow-sm">
                      {product.kind === 'website' ? 'Website' : 'App'}
                    </span>
                    {product.status && (
                      <span className="rounded-full bg-primary-50/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary-800 shadow-sm dark:bg-primary-500/20 dark:text-primary-200">
                        {product.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-extrabold">
                    {product.name ?? <Todo label="product name" />}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {product.summary ?? product.description ?? <Todo label="product summary" />}
                  </p>

                  {product.summary && product.description && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{product.description}</p>
                  )}

                  {product.platforms.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.platforms.map((platform) => (
                        <span key={platform} className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-3 border-t border-line pt-4">
                    {product.downloadUrl && (
                      <a
                        href={product.downloadUrl}
                        {...(product.downloadUrl.startsWith('/')
                          ? {}
                          : { target: '_blank', rel: 'noopener noreferrer' })}
                        className="btn-primary text-sm"
                      >
                        Download
                        <Icon name="download" className="h-4 w-4" />
                      </a>
                    )}
                    {product.websiteUrl && (
                      <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                        Visit website
                        <Icon name="arrow-up-right" className="h-4 w-4" />
                      </a>
                    )}
                    {!product.downloadUrl && !product.websiteUrl && (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {product.kind === 'website' ? <Todo label="website link" /> : <Todo label="download link" />}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Cta title="Have a product idea?" text="We can help you design, build and launch apps and websites." />
    </>
  );
}
