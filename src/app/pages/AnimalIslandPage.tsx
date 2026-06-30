import { useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, Star } from "lucide-react";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { animalGroups, loadAnimalProgress } from "../data/animalData";

export function AnimalIslandPage() {
  const navigate = useNavigate();
  const progress = useMemo(() => loadAnimalProgress(), []);

  return (
    <div className="relative min-h-screen overflow-x-hidden app-sky-background px-4 py-5 text-slate-700 sm:px-7">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[-42px] top-28 h-20 w-44 rounded-full bg-white/65" />
        <span className="absolute right-[-30px] top-44 h-16 w-40 rounded-full bg-white/60" />
        <span className="absolute bottom-28 left-[8%] h-12 w-12 rounded-full bg-emerald-200/70" />
        <span className="absolute bottom-48 right-[9%] h-10 w-10 rounded-full bg-amber-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <KidioPageHeader
          backLabel="Back to Journey"
          backTo="/learning-map"
          title={
            <div className="text-center">
              <h1 className="text-3xl font-black text-[#183B5B] sm:text-5xl">
                Animal Island
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-500 sm:text-xl">
                Listen, learn, and play with animals!
              </p>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-lg font-black text-amber-600 shadow-md">
              <Star className="h-6 w-6 fill-amber-300 text-amber-300" />
              +3
            </div>
          }
        />

        <main className="mt-7">
          <section className="grid gap-5 lg:grid-cols-3">
            {animalGroups.map((group) => {
              const completed = Boolean(progress[group.id]);

              return (
                <motion.article
                  key={group.id}
                  whileHover={{ y: -6 }}
                  className="flex min-h-[360px] flex-col rounded-[2rem] bg-white/92 p-6 text-center shadow-xl ring-1 ring-white"
                >
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[1.75rem] bg-emerald-100 p-3 text-6xl">
                    {group.image ? (
                      <img
                        src={group.image}
                        alt={group.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      group.icon
                    )}
                  </div>
                  {completed ? (
                    <div className="mt-5 flex justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-base font-black text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                        Completed
                      </span>
                    </div>
                  ) : null}
                  <h2 className={`${completed ? "mt-4" : "mt-5"} text-3xl font-black text-[#183B5B]`}>
                    {group.title}
                  </h2>
                  <p className="mt-2 text-lg font-bold text-slate-500">{group.subtitle}</p>
                  <p className="mt-4 rounded-[1.25rem] bg-amber-50 px-4 py-3 text-base font-black text-amber-700">
                    {group.gameLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(group.route)}
                    className="mt-auto min-h-14 rounded-full bg-emerald-500 px-8 py-3 text-xl font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
                  >
                    Start
                  </button>
                </motion.article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
