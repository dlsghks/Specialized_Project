import { useLayoutEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { athleteGroups, athleteImage, communityGuides, communityImages, officialCommunity } from "../data/community";
import { NotFound } from "./NotFound";
import "../styles/pages/Community.scss";

export function CommunityDetail() {
    const { id } = useParams();
    const group = athleteGroups.find(({ athletes }) => athletes.some((athlete) => athlete.id === id));
    const athlete = group?.athletes.find((entry) => entry.id === id);
    const guide = communityGuides.find((entry) => entry.id === id);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!athlete && !guide) return <NotFound />;

    return (
        <article className="community-detail community-width">
            <Link className="community-detail__back" to={athlete ? `/community?tab=athletes&discipline=${group?.id}` : "/community?tab=stories"}>
                <ArrowLeft size={18} aria-hidden="true" /> {athlete ? "선수 목록" : "스토리 · 가이드"}
            </Link>
            <div className="community-detail__body" data-guide={Boolean(guide)}>
                <img className="community-detail__photo" alt={athlete?.name ?? ""}
                    src={athlete ? athleteImage(athlete.id) : communityImages + guide?.image} />
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
                ) : guide && (
                    <div>
                        <p className="community-detail__category">{guide.category}</p>
                        <h1>{guide.title}</h1>
                        <p>{guide.summary}</p>
                        <a className="community-detail__link" href={officialCommunity + guide.id}>공식 가이드 읽기 <ArrowUpRight size={18} aria-hidden="true" /></a>
                    </div>
                )}
            </div>
        </article>
    );
}
