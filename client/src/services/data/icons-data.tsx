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
import FaBrain from "~icons/fa6-solid/brain";
import FaPen from "~icons/fa6-solid/pen-fancy";
import FaIt from "~icons/fa6-solid/laptop-code";
import FaCube from "~icons/fa6-solid/cube";
import FaDna from "~icons/fa6-solid/dna";

import IcArticle from "~icons/ic/round-article";
import IcMovie from "~icons/ic/round-movie";
import IcSpell from "~icons/ic/round-spellcheck";
import IcAudio from "~icons/ic/round-spatial-audio-off";
import IcText from "~icons/ic/round-text-fields";
import GiChessQueen from "~icons/game-icons/chess-queen";
import HiLightBulb from "~icons/heroicons-solid/light-bulb";
import IoMdRocket from "~icons/ion/md-rocket";
import LiaAtomSolid from "~icons/la/atom";
import LuDivide from "~icons/lucide/divide";
import LuLanguages from "~icons/lucide/languages";
import TbMath from "~icons/tabler/math";
import MdGames from "~icons/ic/baseline-games";

export const socialMediaIcons: { [iconName: string]: ReactNode } = {
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  email: <FaEnvelope />,
  phone: <FaPhoneAlt />,
};

export const generalIcons: { [iconName: string]: ReactNode } = {
  article: <IcArticle />,
  atom: <LiaAtomSolid />,
  brain: <FaBrain />,
  bulb: <HiLightBulb />,
  chess: <GiChessQueen />,
  clock: <FaClock />,
  cube: <FaCube />,
  debate: <BiSolidConversation />,
  division: <LuDivide />,
  dna: <FaDna />,
  games: <MdGames />,
  globe: <FaGlobeAsia />,
  it: <FaIt />,
  language: <LuLanguages />,
  math: <TbMath />,
  movie: <IcMovie />,
  paint: <FaPalette />,
  pen: <FaPen />,
  puzzle: <FaPuzzlePiece />,
  robot: <FaRobot />,
  rocket: <IoMdRocket />,
  speech: <IcAudio />,
  spell: <IcSpell />,
  star: <FaStar />,
  text: <IcText />,
  workshops: <FaChalkboardTeacher />,
};

export const icons: { [iconName: string]: ReactNode } = {
  ...socialMediaIcons,
  ...generalIcons,
};
