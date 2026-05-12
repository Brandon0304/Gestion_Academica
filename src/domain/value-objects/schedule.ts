export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export class Schedule {
  constructor(
    public readonly days: DayOfWeek[],
    public readonly startTime: string,
    public readonly endTime: string,
  ) {
    if (days.length === 0) throw new Error('Schedule must have at least one day')
    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      throw new Error('Schedule times must be in HH:mm format')
    }
  }

  conflictsWith(other: Schedule): boolean {
    const hasCommonDay = this.days.some((d) => other.days.includes(d))
    if (!hasCommonDay) return false
    return this.startTime < other.endTime && this.endTime > other.startTime
  }

  toJSON() {
    return { days: this.days, startTime: this.startTime, endTime: this.endTime }
  }

  static fromJSON(data: { days: DayOfWeek[]; startTime: string; endTime: string }): Schedule {
    return new Schedule(data.days, data.startTime, data.endTime)
  }
}
