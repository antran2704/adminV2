import { Modal, ModalProps } from "antd";
import { BiSolidError } from "react-icons/bi";
import { FaInfoCircle } from "react-icons/fa";
import { MdOutlineError } from "react-icons/md";

interface Props extends ModalProps {
  title: string;
  subtitle?: string;
  type: "info" | "danger" | "error";
  description?: string;
  children?: React.ReactNode;
}

const ModalConfirm = (props: Props) => {
  const {
    title,
    subtitle,
    type = "danger",
    description,
    children,
    ...prop
  } = props;

  return (
    <Modal
      centered
      title={
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center rounded-full">
            {type === "danger" && (
              <BiSolidError className="text-3xl text-[#F0A328]" />
            )}
            {type === "info" && (
              <FaInfoCircle className="text-3xl text-primary-200" />
            )}
            {type === "error" && (
              <MdOutlineError className="text-3xl text-red-500" />
            )}
          </div>
          <div>
            <p className="text-lg">{title}</p>
            {subtitle && <p className="text-base font-normal">{subtitle}</p>}
            {description && (
              <p className="text-base font-normal italic py-2">{description}</p>
            )}
          </div>
        </div>
      }
      {...prop}
    >
      {children}
    </Modal>
  );
};

export default ModalConfirm;
