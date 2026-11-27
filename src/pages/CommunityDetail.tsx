import { useLayoutEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { athleteGroups, athleteImage, communityGuides, communityImages, officialCommunity } from "../data/community";
import { communityStories, storySearch, storyTagLabel } from "../data/communityStories";
import { NotFound } from "./NotFound";
import "../styles/pages/Community.scss";

export function CommunityDetail({ kind }: { kind?: "story" }) {
    const { id } = useParams();
    const location = useLocation();
    const group = kind === "story" ? undefined : athleteGroups.find(({ athletes }) => athletes.some((athlete) => athlete.id === id));
    const athlete = group?.athletes.find((entry) => entry.id === id);
    const story = kind === "story" ? communityStories.find((entry) => entry.id === id) : undefined;
    const guide = kind === "story" ? undefined : communityGuides.find((entry) => entry.id === id);
    const editorial = story ?? guide;
    const storyList = location.state?.storyList;
    const returnToStories = typeof storyList === "string" && storyList.startsWith("?tab=stories") ? storyList : storySearch();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!athlete && !editorial) return <NotFound />;

    return (
        <article className="community-detail community-width">
            <Link className="community-detail__back" to={athlete ? `/community?tab=athletes&discipline=${group?.id}` : `/community${returnToStories}`}>
                <ArrowLeft size={18} aria-hidden="true" /> {athlete ? "선수 목록" : "스토리 · 가이드"}
            </Link>
            <div className="community-detail__body" data-guide={Boolean(editorial)}>
                <img className="community-detail__photo" alt={athlete?.name ?? ""}
                    src={athlete ? athleteImage(athlete.id) : communityImages + editorial?.image} />
                {athlete ? (
                    <div>
                        <p className="community-detail__category">{group?.label}</p>
                        <h1>{athlete.name}</h1>
                        <dl>
                            <div><dt>국가</dt><dd>{athlete.country}</dd></div>
                            <div><dt>소속 팀</dt><dd>{athlete.team}</dd></div>
                        </dl>
                        <a className="community-detail__link" href={officialCommunity + athlete.id}>공식 프로필 보기 <ArrowUpRight size={18} aria-hidden="true" /></a>
                    </div>
                ) : editorial && (
                    <div>
                        <p className="community-detail__category">{story?.tags.map(storyTagLabel).join(", ") || guide?.category || "스토리"}</p>
                        <h1>{editorial.title}</h1>
                        {"date" in editorial && editorial.date && (
                            <time className="community-detail__date" dateTime={editorial.date}>{editorial.date.replaceAll("-", ".")}</time>
                        )}
                        <p>{editorial.summary}</p>
                        <a className="community-detail__link" href={officialCommunity + editorial.id}>
                            {story ? "공식 원문 읽기" : "공식 가이드 읽기"} <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
}
