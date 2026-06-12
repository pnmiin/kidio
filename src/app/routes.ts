import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { SelectAccountType } from "./pages/SelectAccountType";
import { ParentLogin } from "./pages/ParentLogin";
import { KidLogin } from "./pages/KidLogin";
import { KidDashboard } from "./pages/KidDashboard";
import { LearningJourneyPage } from "./pages/LearningJourneyPage";
import { VideoLesson } from "./pages/VideoLesson";
import { MiniGame } from "./pages/MiniGame";
import { RewardPage } from "./pages/RewardPage";
import { ParentDashboard } from "./pages/ParentDashboard";
import { Checkout } from "./pages/Checkout";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { CustomerSupport } from "./pages/CustomerSupport";
import { TraceLetterGame } from "./pages/TraceLetterGame";
import { ColorGamesPage } from "./pages/ColorGamesPage";
import { VocabularyAnimals } from "./pages/VocabularyAnimals";
import { PlacementQuizPage } from "./pages/PlacementQuizPage";
import { BodyPartsAdventurePage } from "./pages/BodyPartsAdventurePage";
import { BodyPartsReviewPage } from "./pages/BodyPartsReviewPage";
import { AdminDashboard } from "../pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/select-account",
    Component: SelectAccountType,
  },
  {
    path: "/parent-login",
    Component: ParentLogin,
  },
  {
    path: "/kid-login",
    Component: KidLogin,
  },
  {
    path: "/placement",
    Component: PlacementQuizPage,
  },
  {
    path: "/kid-home",
    Component: KidDashboard,
  },
  {
    path: "/kid-dashboard",
    Component: KidDashboard,
  },
  {
    path: "/learning-map",
    Component: LearningJourneyPage,
  },
  {
    path: "/learning-journey",
    Component: LearningJourneyPage,
  },
  {
    path: "/video-lesson",
    Component: VideoLesson,
  },
  {
    path: "/mini-game",
    Component: MiniGame,
  },
  {
    path: "/reward",
    Component: RewardPage,
  },
  {
    path: "/parent-dashboard",
    Component: ParentDashboard,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/payment-success",
    Component: PaymentSuccess,
  },
  {
    path: "/customer-support",
    Component: CustomerSupport,
  },
  {
    path: "/trace-letter",
    Component: TraceLetterGame,
  },
  {
    path: "/color-games",
    Component: ColorGamesPage,
  },
  {
    path: "/vocabulary-animals",
    Component: VocabularyAnimals,
  },
  {
    path: "/adventure/body-parts",
    Component: BodyPartsAdventurePage,
  },
  {
    path: "/review/body-parts",
    Component: BodyPartsReviewPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
