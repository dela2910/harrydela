"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobs, setJobs] = useState<string[]>([]);
  const [customJob, setCustomJob] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      setLoading(true);
      const hasOther = jobs.includes("otro");
      const selectedWithoutOther = jobs.filter((j) => j !== "otro");
      const combinedJob = [
        ...selectedWithoutOther,
        hasOther && customJob.trim()
          ? `otro: ${customJob.trim()}`
          : hasOther
            ? "otro"
            : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, contact, job: combinedJob }),
      });

      if (!res.ok) {
        throw new Error("Error al guardar los datos");
      }

      setMessage("Respuestas Enviadas Correctamente");
      setFirstName("");
      setLastName("");
      setJobs([]);
      setCustomJob("");
      setContact("");
    } catch (error) {
      setMessage("Hubo un problema al guardar los datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 px-4 font-sans dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <main className="w-full max-w-3xl rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:bg-zinc-900/90">
        <div className="mb-8 text-center">
          <p className="mb-2 inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
            Tu próximo paso laboral
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-zinc-900 sm:text-4xl md:text-5xl dark:text-zinc-50">
            ¿Cansado de postular a tantas empresas?
          </h1>
          <p className="mt-4 text-base text-zinc-700 sm:text-lg dark:text-zinc-300">
            ¿Buscas trabajo sin un título profesional?
          </p>
        </div>

        <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-md dark:border-indigo-900/40 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Cuéntanos un poco de ti
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Escribe tu nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
              </div>

              <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Escribe tu apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
              </div>
              <div>
              <label
                htmlFor="contact"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Contacto
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                placeholder="Ej: +56 9 12345678"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
              <div>
                <p className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Trabajo(s) que te interesa(n)
                </p>
                <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Puedes seleccionar una o varias opciones.
                </p>
                <div className="space-y-1">
                  {[
                    { id: "chef", label: "Chef" },
                    { id: "ayudante-cocina", label: "Ayudante de cocina" },
                    { id: "auxiliar-cocina", label: "Auxiliar de cocina" },
                    { id: "operador-grúa", label: "Operador de grúa" },
                    { id: "bodeguero", label: "Bodeguero" },
                    { id: "recepcionista", label: "Recepcionista" },
                    { id: "limpiador", label: "Limpiador" },
                    { id: "otro", label: "Otro" },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800/70"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800"
                        checked={jobs.includes(option.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setJobs((prev) =>
                              prev.includes(option.id)
                                ? prev
                                : [...prev, option.id],
                            );
                          } else {
                            setJobs((prev) =>
                              prev.filter((value) => value !== option.id),
                            );
                          }
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {jobs.includes("otro") && (
                  <div className="mt-3">
                    <label
                      htmlFor="customJob"
                      className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Escribe el trabajo que te interesa
                    </label>
                    <input
                      id="customJob"
                      name="customJob"
                      type="text"
                      placeholder="Ej: Maestro pastelero, barista, etc."
                      value={customJob}
                      onChange={(e) => setCustomJob(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
              >
                {loading ? "Guardando..." : "Guardar respuestas"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <aside className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 p-6 text-left shadow-md dark:border-sky-900/40 dark:from-sky-950/60 dark:via-cyan-950/40 dark:to-emerald-950/40">
              <h3 className="mb-2 text-base font-semibold text-sky-900 dark:text-sky-100">
                Buscamos innovar el reclutamiento de personas
              </h3>
              <p className="text-sm text-sky-900/80 dark:text-sky-100/80">
                Creemos que tu historia, tu experiencia y tus ganas de crecer importan más que un papel. Queremos conectar talento real con oportunidades reales.
              </p>
            </aside>

            <aside className="rounded-2xl border border-fuchsia-100 bg-white/80 p-6 text-left shadow-md dark:border-fuchsia-900/40 dark:bg-zinc-900/80">
              <h3 className="mb-3 text-base font-semibold text-fuchsia-900 dark:text-fuchsia-100">
                ¿Por qué te preguntamos esto?
              </h3>
              <p className="mb-3 text-sm text-fuchsia-900/80 dark:text-fuchsia-100/80">
                Queremos hacer que la contratación sea más eficiente para ti y con menos complicaciones.
              </p>
              <p className="text-sm text-fuchsia-900/80 dark:text-fuchsia-100/80">
                No necesitas un título profesional para dar el siguiente paso. Solo claridad sobre tus intereses y ganas de avanzar.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
