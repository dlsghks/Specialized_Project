import { Link } from "react-router-dom";
import { bikePhoto, customizeBikes } from "./customizeBikes";
import "../styles/pages/Customize.scss";

export const CustomizeModels = () => (
    <section className="bike-build bike-build__model-picker">
        <h1>3D 빌드 모델 선택</h1>
        <div className="bike-build__options">
            {customizeBikes.map(({ id, category, name }) => (
                <Link className="bike-build__option bike-build__bike-card" key={id} to={`/customize/${id}`}>
                    <img src={bikePhoto(id)} alt="" width={800} height={475} />
                    <span>{category}<strong>{name}</strong></span>
                </Link>
            ))}
        </div>
    </section>
);
