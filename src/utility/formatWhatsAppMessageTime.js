import moment from "moment";

export default function formatWhatsAppMessageTime(timestamp) {
  const momentTimestamp = moment(timestamp).startOf("day");
  const currentDate = moment().startOf("day");
  const timeDiff = currentDate.diff(momentTimestamp, "days");
  // console.log(momentTimestamp);

  if (timeDiff === 0) {
    return "Today" + moment(timestamp).format(" - h:mm a"); // Today
  } else if (timeDiff === 1) {
    return "Yesterday" + moment(timestamp).format(" - h:mm a"); // Yesterday
  } else if (timeDiff < 7) {
    return (
      moment(timestamp).format("dddd") + moment(timestamp).format(" - h:mm a")
    ); // This week
  } else {
    return moment(timestamp).format("DD/MM/YYYY - h:mm a"); // Older than a week
  }
}
