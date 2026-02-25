import { Outlet } from "react-router-dom";
import Navbar from "@/components/molecules/Navbar/Navbar";
import Sidebar from "../../components/organisms/Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
