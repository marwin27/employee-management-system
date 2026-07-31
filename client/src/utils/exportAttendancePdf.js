import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const formatMinutes = (minutes) => {
  if (!minutes) return "-";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
};

export const exportAttendancePdf = ({
  reports,
  month,
  year,
  summary,
  user,
}) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Attendance Report", 14, 18);

  doc.setFontSize(12);
  doc.text(dayjs(`${year}-${month}-01`).format("MMMM YYYY"), 14, 28);

  doc.text(`Employee: ${user.firstName} ${user.lastName}`, 14, 40);
  doc.text(`Employee ID: ${user.employeeId}`, 14, 47);

  doc.text(`Department: ${user.department}`, 110, 40);
  doc.text(`Position: ${user.position}`, 110, 47);

  doc.text(`Worked: ${summary.worked}`, 14, 62);
  doc.text(`Present: ${summary.present}`, 55, 62);
  doc.text(`Late: ${summary.late}`, 95, 62);
  doc.text(`Half Day: ${summary.halfDay}`, 135, 62);

  doc.text(`Absent: ${summary.absent}`, 14, 70);
  doc.text(`Overtime: ${formatMinutes(summary.overtime)}`, 55, 70);

  autoTable(doc, {
    startY: 82,
    head: [["Date", "Time In", "Time Out", "Late", "OT", "Status"]],
    body: reports.map((record) => [
      dayjs(record.date).format("MMM D, YYYY"),
      dayjs(record.timeIn).format("h:mm A"),
      record.timeOut ? dayjs(record.timeOut).format("h:mm A") : "-",
      formatMinutes(record.lateMinutes),
      formatMinutes(record.overtimeMinutes),
      record.status,
    ]),
  });

  doc.save(`Attendance_Report_${month}_${year}.pdf`);
};
