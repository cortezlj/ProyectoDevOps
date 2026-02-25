import styles from "./StatCard.module.css";

type Props = {
  title: string;
  value: number;
};

const StatCard = ({ title, value }: Props) => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <h2 className={styles.value}>{value}</h2>
    </div>
  );
};

export default StatCard;
