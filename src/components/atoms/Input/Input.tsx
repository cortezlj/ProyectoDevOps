import styles from './Input.module.css';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => {
  return <input className={styles.input} {...props} />;
};

export default Input;
