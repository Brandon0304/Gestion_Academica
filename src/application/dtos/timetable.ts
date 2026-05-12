export interface TimetableEntry {
  courseId: string
  courseCode: string
  courseName: string
  teacherName: string
  classroomName: string
  days: string[]
  startTime: string
  endTime: string
}

export interface TimetableOutput {
  entries: TimetableEntry[]
}
