import StartupCard, { StartupCardType } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
// import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  /**
   * Commented out as we are now live fetching the data from sanity. If we don't want to use live fetching, we can use the below code
   */
  // const posts = await client.fetch(STARTUPS_QUERY);

  /**
   * Code for live fetching the data from sanity
   */
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  const session = await auth();

  return (
    <>
      <section className="pink_container">
        <h1 className="heading mx-auto">
          Pitch your startup, <br />
          Connect with entreprenuers
        </h1>
        <p className="sub-heading !max-w-3xl !font-extralight">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Results for: ${query}` : "Trending Ideas"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <StartupCard key={post._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startup found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}

export default Page;
