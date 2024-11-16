import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

export const experimental_ppr = true;

const md = markdownit();

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Parallel loading: combining post and selectedStartup calls
  const [post, { selectedStartups }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "featured-picks" }),
  ]);
  // const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  // const { selectedStartups } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
  //   slug: "featured-picks",
  // });
  // console.log(selectedStartups);
  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post?.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post?.image}
          className="w-full h-auto rounded-xl"
          alt="thumbnail"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post?.author?.image}
                alt=""
                width={64}
                height={64}
                className="full-rounded drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post?.author?.name}</p>
                <p className="text-16-light !text-black-300">
                  @{post?.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post?.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className="prose max-w-4xl font-work-sans break-all"
            />
          ) : (
            <p className="no-result">No pitch details available</p>
          )}
        </div>
        <hr className="divider" />

        {selectedStartups?.length > 0 && (
          <div className="mex-w-4xl mx-auto">
            <p className="text-30-semibold">Featured Startups</p>
            <ul className="mt-7 card_grid">
              {selectedStartups.map((post: StartupCardType, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
