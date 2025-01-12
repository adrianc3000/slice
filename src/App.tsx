import { SyntheticEvent } from "react";

import ReactCrop, { Crop, PercentCrop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';

import Overlay from "./components/Overlay";
import Sidebar from "./components/Sidebar";

import './App.css'
import { loadingAtom, profilesAtom, sourceAtom } from "./store";
import { useAtom } from "jotai";
import { centerCropImage } from "./utils/utils";

const App = () => {
    const [profiles, setProfiles] = useAtom(profilesAtom)

    const activeProfile = () => {
        return profiles.find(p => p.active)
    }

    function updateCrop(_crop: Partial<Crop>, percentCrop: PercentCrop) {
        if (!percentCrop.height || !percentCrop.width) return;
        let p = [...profiles];
        let active = p.find(p => p.active)
        if (!active) return;
        active.crop = percentCrop
        setProfiles(p);
    }

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        const crop = centerCropImage(e.currentTarget)
        updateCrop({}, crop)
        setLoading(false)
    }

    const [source, ] = useAtom(sourceAtom)
    const [loading, setLoading] = useAtom(loadingAtom)

    return (
        <>
            <Overlay active={loading} />
            <div className="crop-container">
                {source &&
                    <ReactCrop
                        aspect={1}
                        minHeight={64}
                        minWidth={64}
                        crop={activeProfile()?.crop}
                        onChange={updateCrop}
                        ruleOfThirds
                        circularCrop
                        style={{ maxHeight: 'inherit' }}
                    >
                        <img src={source.src} onLoad={onImageLoad} />
                    </ReactCrop>
                }
            </div>
            <Sidebar />
        </>
    )
}

export default App