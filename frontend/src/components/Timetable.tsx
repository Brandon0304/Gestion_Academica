"use client"

interface TimetableEntry {
  courseId: string
  courseCode: string
  courseName: string
  teacherName: string
  classroomName: string
  days: string[]
  startTime: string
  endTime: string
}

interface TimetableProps {
  entries: TimetableEntry[]
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
const DAY_LABELS: Record<string, string> = {
  monday: "Lun", tuesday: "Mar", wednesday: "Mié", thursday: "Jue", friday: "Vie", saturday: "Sáb",
}

const HOURS = Array.from({ length: 14 }, (_, i) => `${String(i + 7).padStart(2, "0")}:00`)

function getBlockStyle(startTime: string, endTime: string) {
  const startHour = Number.parseInt(startTime.split(":")[0] ?? "7")
  const endHour = Number.parseInt(endTime.split(":")[0] ?? "8")
  const startMin = Number.parseInt(startTime.split(":")[1] ?? "0")
  const startOffset = startHour - 7 + startMin / 60
  const duration = Math.max(endHour - startHour + (Number.parseInt(endTime.split(":")[1] ?? "0") - startMin) / 60, 0.5)
  return {
    top: `${startOffset * 4}rem`,
    height: `${duration * 4}rem`,
  }
}

const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
]

export function Timetable({ entries }: TimetableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-400">
        No hay cursos asignados en este horario
      </div>
    )
  }

  const courseColors: Record<string, string> = {}
  entries.forEach((e, i) => {
    courseColors[e.courseId] = COLORS[i % COLORS.length]!
  })

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-[5rem_repeat(6,1fr)] border-b">
          <div className="border-r p-2 text-center text-xs font-medium text-slate-500">Hora</div>
          {DAYS.map((day) => (
            <div key={day} className="border-r p-2 text-center text-xs font-medium text-slate-500 last:border-r-0">
              {DAY_LABELS[day]}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="relative grid grid-cols-[5rem_repeat(6,1fr)]">
          {/* Time labels */}
          <div className="border-r">
            {HOURS.map((hour) => (
              <div key={hour} className="flex h-16 items-start justify-center border-b pt-1 text-xs text-slate-400 last:border-b-0">
                {hour}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day) => (
            <div key={day} className="relative border-r last:border-r-0">
              <div className="pointer-events-none relative">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-16 border-b last:border-b-0" />
                ))}
              </div>

              {/* Course blocks */}
              {entries
                .filter((e) => e.days.includes(day))
                .map((entry) => (
                  <div
                    key={`${entry.courseId}-${day}`}
                    className={`absolute left-1 right-1 rounded border-2 p-1.5 text-xs shadow-sm ${courseColors[entry.courseId]}`}
                    style={getBlockStyle(entry.startTime, entry.endTime)}
                  >
                    <p className="font-semibold leading-tight">{entry.courseCode}</p>
                    <p className="leading-tight">{entry.teacherName}</p>
                    <p className="leading-tight text-[10px] opacity-75">{entry.classroomName}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
