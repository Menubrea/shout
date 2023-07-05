export default function getTime(date: Date) {
  const createdDate = new Date(date || "");
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - createdDate.getTime();

  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  let timeAgo = "";
  if (daysDifference > 0) {
    timeAgo = `${daysDifference} day${daysDifference === 1 ? "" : "s"} ago`;
  } else if (hoursDifference > 0) {
    timeAgo = `${hoursDifference} hour${hoursDifference === 1 ? "" : "s"} ago`;
  } else if (minutesDifference > 0) {
    timeAgo = `${minutesDifference} minute${
      minutesDifference === 1 ? "" : "s"
    } ago`;
  } else {
    timeAgo = "Just now";
  }

  return timeAgo;
}
