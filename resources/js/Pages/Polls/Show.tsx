import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import TierBoard, { Candidate, CandidateGroup } from "@/Components/poll/TierBoard";
import { Button } from "@/components/ui/button";

export default function PollShow({ poll, categories, candidates }: any) {
  const groups: CandidateGroup[] = useMemo(() => {
    const cats = categories || [];
    const cands = candidates || [];
    
    // Group candidates by category_id
    return cats.map((cat: any) => ({
      id: cat.id,
      name: cat.name_ar,
      key: cat.key || null,
      isDefault: Boolean(cat.is_default),
      candidates: cands
        .filter((c: any) => c.category_id === cat.id)
        .sort((a: any, b: any) => a.sort - b.sort)
        .map((c: any) => ({
          id: c.id,
          name: c.name_ar,
          title: c.title_ar,
          imageUrl: c.image_url,
          category: c.category_key,
          sort: c.sort,
        })),
    }));
  }, [categories, candidates]);

  const flatCandidates: Candidate[] = useMemo(() => {
    return (candidates || []).map((c: any) => ({
      id: c.id,
      name: c.name_ar,
      title: c.title_ar,
      imageUrl: c.image_url,
      category: c.category_key,
      sort: c.sort,
    }));
  }, [candidates]);

  const description = poll.title_ar
    ? `شارك في "${poll.title_ar}" على المساحة السورية وصنّف المرشحين والجهات حسب المستويات.`
    : 'شارك في التصنيف التفاعلي المجتمعي على المساحة السورية.';

  return (
    <MainLayout title={`${poll.title_ar} - المساحة السورية`} description={description}>
      <div className="max-w-screen-lg mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{poll.title_ar}</h1>
          <p className="text-muted-foreground text-sm mb-4">
            اسحب البطاقات لترتيبها ضمن المستويات (من S إلى F)، أو اضغط على البطاقة لاختيار المستوى مباشرة، ثم شارك تقييمك!
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" size="lg">
              <Link href={`/polls/${poll.slug}/leaderboard`}>
                عرض النتائج العامة
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <TierBoard
            pollSlug={poll.slug}
            initial={flatCandidates}
            groups={groups.length > 0 ? groups : undefined}
          />
        </div>
      </div>
    </MainLayout>
  );
}
