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
import { ColorHuntGame } from "./pages/ColorHuntGame";
import { ColorMixGame } from "./pages/ColorMixGame";
import { VocabularyAnimals } from "./pages/VocabularyAnimals";
import { PlacementQuizPage } from "./pages/PlacementQuizPage";
import { BodyPartsAdventurePage } from "./pages/BodyPartsAdventurePage";
import { BodyPartsReviewPage } from "./pages/BodyPartsReviewPage";
import { NumberLandMap } from "./pages/NumberLandMap";
import { NumberVillageGame } from "./pages/NumberVillageGame";
import { TeenTownGame } from "./pages/TeenTownGame";
import { TensMountainGame } from "./pages/TensMountainGame";
import { BigNumberCityGame } from "./pages/BigNumberCityGame";
import { ReviewParkGame } from "./pages/ReviewParkGame";
import { AnimalIslandPage } from "./pages/AnimalIslandPage";
import { AnimalGroupPage } from "./pages/AnimalGroupPage";
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
    path: "/color-world",
    Component: ColorGamesPage,
  },
  {
    path: "/color-world/color-hunt",
    Component: ColorHuntGame,
  },
  {
    path: "/color-world/mix",
    Component: ColorMixGame,
  },
  {
    path: "/vocabulary-animals",
    Component: VocabularyAnimals,
  },
  {
    path: "/animal-island",
    Component: AnimalIslandPage,
  },
  {
    path: "/animal-island/:groupId",
    Component: AnimalGroupPage,
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
    path: "/number-land",
    Component: NumberLandMap,
  },
  {
    path: "/number-land/village",
    Component: NumberVillageGame,
  },
  {
    path: "/number-land/teen-town",
    Component: TeenTownGame,
  },
  {
    path: "/number-land/tens-mountain",
    Component: TensMountainGame,
  },
  {
    path: "/number-land/big-number-city",
    Component: BigNumberCityGame,
  },
  {
    path: "/number-land/review-park",
    Component: ReviewParkGame,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
]);
