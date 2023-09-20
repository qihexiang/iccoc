import apiRequireAdmin from "@/lib/apiRequireAdmin";
import prisma from "@/lib/prisma";
import { Parser } from "@json2csv/plainjs";
import { NextRequest } from "next/server";

const parser = new Parser();

export async function GET(req: NextRequest) {
  const isAdminCheck = await apiRequireAdmin();
  if (isAdminCheck instanceof Response) return isAdminCheck;

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          collaborators: true,
          projects: true,
        },
      },
      travel: true,
      hotelBooking: true,
    },
  });

  const forCsv = users.map(
    ({
      id,
      email,
      name,
      institution,
      title,
      phoneNumber,
      _count,
      travel,
      hotelBooking,
      userType,
    }) => ({
      id,
      email,
      name,
      institution,
      title,
      userType,
      phoneNumber,
      collaborators: _count.collaborators,
      projects: _count.projects,
      hotelReversation: !(hotelBooking?.bookBySelf ?? true),
      hotelLocation: hotelBooking?.location ?? "",
      hotelCheckIn: hotelBooking?.checkinDate.toDateString() ?? "",
      hotelCheckOut: hotelBooking?.checkoutDate.toDateString() ?? "",
      kingRooms: hotelBooking?.kingRooms ?? 0,
      standardRooms: hotelBooking?.standardRooms ?? 0,
      arrivalDate: travel?.arrivalDate.toDateString() ?? "",
      arrivalNo: travel?.arrivalNo ?? "",
      depatureDate: travel?.departureDate.toDateString() ?? "",
      departureNo: travel?.arrivalNo ?? "",
      attendVisit: Boolean(travel?.attendVisit)
    })
  );
  const csv = parser.parse(forCsv);
  return new Response(csv)
}
