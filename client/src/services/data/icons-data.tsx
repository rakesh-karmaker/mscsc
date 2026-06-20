import type { ReactNode } from "react";

import BiSolidConversation from "~icons/bx/bxs-conversation";

import FaChalkboardTeacher from "~icons/fa-solid/chalkboard-teacher";
import FaFacebook from "~icons/fa/facebook";
import FaGlobeAsia from "~icons/fa-solid/globe-asia";
import FaInstagram from "~icons/fa/instagram";
import FaPalette from "~icons/fa-solid/palette";
import FaPhoneAlt from "~icons/fa/phone";
import FaPuzzlePiece from "~icons/fa/puzzle-piece";

import FaClock from "~icons/fa6-regular/clock";
import FaEnvelope from "~icons/fa6-regular/envelope";
import FaRobot from "~icons/fa6-solid/robot";
import FaStar from "~icons/fa6-solid/star";

import GiChessQueen from "~icons/game-icons/chess-queen";
import HiLightBulb from "~icons/heroicons-solid/light-bulb";
import IoMdRocket from "~icons/ion/md-rocket";
import LiaAtomSolid from "~icons/la/atom";
import LuDivide from "~icons/lucide/divide";
import TbMath from "~icons/tabler/math";
import MdGames from "~icons/ic/baseline-games";

export const socialMediaIcons: { [iconName: string]: ReactNode } = {
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  email: <FaEnvelope />,
  phone: <FaPhoneAlt />,
};

export const generalIcons: { [iconName: string]: ReactNode } = {
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

export const icons: { [iconName: string]: ReactNode } = {
  ...socialMediaIcons,
  ...generalIcons,
};
