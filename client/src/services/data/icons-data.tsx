import type { ReactNode } from "react";
import { BiSolidConversation } from "react-icons/bi";
import {
  FaChalkboardTeacher,
  FaFacebook,
  FaGlobeAsia,
  FaInstagram,
  FaPalette,
  FaPhoneAlt,
  FaPuzzlePiece,
} from "react-icons/fa";
import { FaClock, FaEnvelope, FaRobot, FaStar } from "react-icons/fa6";
import { GiChessQueen } from "react-icons/gi";
import { HiLightBulb } from "react-icons/hi";
import { IoMdRocket } from "react-icons/io";
import { LiaAtomSolid } from "react-icons/lia";
import { LuDivide } from "react-icons/lu";
import { TbMath } from "react-icons/tb";
import { MdGames } from "react-icons/md";

export const icons: { [iconName: string]: ReactNode } = {
  // social media icons
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  email: <FaEnvelope />,
  phone: <FaPhoneAlt />,

  // general icons
  division: <LuDivide />,
  rocket: <IoMdRocket />,
  chess: <GiChessQueen />,
  atom: <LiaAtomSolid />,
  robot: <FaRobot />,
  bulb: <HiLightBulb />,
  globe: <FaGlobeAsia />,
  paint: <FaPalette />,
  math: <TbMath />,
  puzzle: <FaPuzzlePiece />,
  debate: <BiSolidConversation />,
  star: <FaStar />,
  games: <MdGames />,
  workshops: <FaChalkboardTeacher />,
  clock: <FaClock />,
};
