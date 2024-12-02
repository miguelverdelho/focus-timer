class Times {
    constructor(id, date, elapsedTimes) {
        (this.id = id),
        (this.elapsedTimes = elapsedTimes),
        (this.date = date)
    }
  }

  class ElapsedTimes {
    constructor(working, coding, studying, gaming) {
        (this.working = working),
        (this.coding = coding),
        (this.studying = studying),
        (this.gaming = gaming)
    }
}
  
export default Times;