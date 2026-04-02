import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { createPortal } from "react-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Project } from "./ProjectsSection"; // Ensure this path matches your setup

/* -------------------------------------------------------------------------- */
/* Custom Hook for Media Query                                                */
/* -------------------------------------------------------------------------- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/* -------------------------------------------------------------------------- */
/* DESKTOP MODAL (Radix UI)                                                   */
/* -------------------------------------------------------------------------- */
const DesktopModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const [activeMedia, setActiveMedia] = useState<string>(project.video);
  const [fullscreen, setFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Trigger GSAP entrance animation when the Radix content mounts
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />

        {/* Modal Content */}
        <Dialog.Content
          ref={contentRef}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-6xl h-[95vh] bg-[#0b0b0b] rounded-xl border border-white/10 shadow-2xl overflow-hidden focus:outline-none flex flex-col"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center p-5 border-b border-white/10 flex-shrink-0">
            <div>
              <Dialog.Title className="font-display text-2xl text-white">
                {project.title}
              </Dialog.Title>
              <Dialog.Description className="text-xs tracking-widest text-primary uppercase mt-1">
                {project.category}
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button className="text-white/60 hover:text-white text-xl outline-none">
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* CONTENT */}
          <div className="p-5 flex-1 flex flex-col overflow-y-auto">
            {/* Main Layout */}
            <div className="flex gap-6 h-[75%] min-h-[400px]">
              {/* Main Media */}
              <div className="relative w-[70%] aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0">
                {activeMedia.endsWith(".mp4") ? (
                  <video
                    src={activeMedia}
                    autoPlay
                    controls
                    playsInline
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={activeMedia}
                    onClick={() => setFullscreen(true)}
                    className="w-full h-full object-cover cursor-zoom-in"
                    alt="Project view"
                  />
                )}
              </div>

              {/* Right Side Info */}
              <div className="flex flex-col justify-between w-[30%]">
                <p className="text-lg text-white/70 leading-relaxed">
                  {project.description}
                </p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-center border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-black transition"
                >
                  Смотреть проект
                </a>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto mt-5 pb-2">
              <button
                onClick={() => setActiveMedia(project.video)}
                className={`relative aspect-video min-w-[120px] rounded-md overflow-hidden border transition-colors ${
                  activeMedia === project.video ? "border-primary" : "border-white/10"
                }`}
              >
                <video
                  src={project.video}
                  muted
                  className="w-full h-full object-cover opacity-80"
                />
              </button>

              {project.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(img)}
                  className={`aspect-video min-w-[120px] rounded-md overflow-hidden border transition-colors ${
                    activeMedia === img ? "border-primary" : "border-white/10"
                  }`}
                >
                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen Image Overlay inside Radix */}
          {fullscreen && (
            <div
              className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out z-[200]"
              onClick={() => setFullscreen(false)}
            >
              <img
                src={activeMedia}
                className="max-h-full max-w-full object-contain"
                alt="Fullscreen view"
              />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

/* -------------------------------------------------------------------------- */
/* MOBILE MODAL (Original custom portal logic)                                */
/* -------------------------------------------------------------------------- */
const MobileModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeMedia, setActiveMedia] = useState<string>(project.video);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!modalRef.current) return;
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalUI = (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[50]"
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-[#0b0b0b] rounded-xl border border-white/10 overflow-hidden shadow-2xl pointer-events-auto"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center p-5 border-b border-white/10">
            <div>
              <h3 className="font-display text-2xl">{project.title}</h3>
              <p className="text-xs tracking-widest text-primary uppercase">
                {project.category}
              </p>
            </div>

            <button onClick={onClose} className="text-white/60 hover:text-white text-xl">
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5 space-y-5">
            {/* MAIN MEDIA */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {activeMedia.endsWith(".mp4") ? (
                <video
                  src={activeMedia}
                  autoPlay
                  controls
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <img
                  src={activeMedia}
                  onClick={() => setFullscreen(true)}
                  className="w-full h-full object-cover cursor-zoom-in"
                  alt="Project view"
                />
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveMedia(project.video)}
                className={`relative aspect-video min-w-[120px] rounded-md overflow-hidden border ${
                  activeMedia === project.video ? "border-primary" : "border-white/10"
                }`}
              >
                <video
                  src={project.video}
                  muted
                  className="w-full h-full object-cover opacity-80"
                />
              </button>

              {project.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(img)}
                  className={`aspect-video min-w-[120px] rounded-md overflow-hidden border ${
                    activeMedia === img ? "border-primary" : "border-white/10"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>

            {/* DESCRIPTION & LINK */}
            <p className="text-sm text-white/70 leading-relaxed text-center">
              {project.description}
            </p>
            <div className="mt-5 text-center">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-black transition"
              >
                Смотреть проект
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out z-[60]"
          onClick={() => setFullscreen(false)}
        >
          <img src={activeMedia} className="max-h-full max-w-full object-contain" alt="Fullscreen" />
        </div>
      )}
    </>
  );

  return createPortal(modalUI, document.body);
};

/* -------------------------------------------------------------------------- */
/* MAIN EXPORT WRAPPER                                                        */
/* -------------------------------------------------------------------------- */
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!project) return null;

  // Render Radix UI for desktop, and the original custom portal for mobile
  return isDesktop ? (
    <DesktopModal project={project} onClose={onClose} />
  ) : (
    <MobileModal project={project} onClose={onClose} />
  );
}