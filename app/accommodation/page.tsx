import ExpandableIframe from "@/components/ExpandableIframe";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accommodation information | ICCOC2023",
};

export default function AccommodationPage() {
  return <div>
    <h1 className="typoblock">Accommodation</h1>
    <div className="flex items-center gap-1 typoblock">
      <Link className="btn info" href="/abstracts/travel">My travel information</Link>
      <Link className="btn info" href="/abstracts/hotelbooking">Hotel booking support</Link>
    </div>
    <p className="typoblock">
      Kindly remind all participants to make hotel reservations soon.
    </p>
    <p className="typoblock">
      Hotel accommodation is not included in the registration fees. However, a
      limited number of rooms are available at special rates to conference
      attendees at the Beijing Guizhou Hotel.
    </p>
    <h2 className="typoblock">Beijing Guizhou Hotel:</h2>
    <p className="typoblock">
      The Beijing Guizhou Hotel provieds special rates for the participatns of
      ICCOC2023. The hotel charges your credit card when you check out. Please
      make your reservations as early as possible because rooms are limited.
    </p>
    <p className="typoblock">Tel: +86-10-58109988</p>
    <div className="typoblock flex items-center gap-1 mb-2">
      <Link className="link" href="https://maps.app.goo.gl/vdVbCUJ1vSe6ixC4A">Google Map</Link>
      <Link className="link" href="https://j.map.baidu.com/6c/p7xJ">Baidu Map</Link>
    </div>
    <ExpandableIframe
      buttonName="Expand Google Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1663.7760957146456!2d116.41846718051349!3d39.97006588140491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f054ad3ae459a5%3A0x250400f6e4aa8a7!2sGuizhou%20Mansion%20Beijing!5e0!3m2!1sen!2sus!4v1682753899645!5m2!1sen!2sus"
      height="450"
      style={{ border: 0, width: "100%" }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></ExpandableIframe>
    <h2 className="typoblock">Guest House of BUCT :</h2>
    <p className="typoblock">
      For students and junior scientists with limited financial budget, we
      help to list several budget hostels in the neighborhood of the ICCOC
      venue. Most of them are dormitory-type and are within walking distance
      either from the venue. Please note that these accommodation are NOT
      affiliated with ICCOC organizers and interested participants should
      refer to the map below and make reservations by themselves.
    </p>
    <p className="typoblock">Tel: +86-10-64435232</p>
    <Link className="link typoblock" href="https://j.map.baidu.com/fa/Kt8J">Baidu Map</Link>
  </div>;
}
