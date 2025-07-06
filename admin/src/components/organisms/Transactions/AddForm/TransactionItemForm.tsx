import {
  defaultTransactionItem,
} from "../transaction-utils";
import { Button } from "@/components/ui/button";
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { useTransactionItemFormLogics } from "./logics";
import { TransactionItemField } from "./TransactionItemField";

export default function TransactionItem() {
  const {
    append,
    fields,
    products,
    productsName,
    register,
    remove,
    totalPrice,
    form,
  } = useTransactionItemFormLogics();

  return (
    <>
      {fields.map((field, index) => (
        <TransactionItemField
          key={field.id}
          index={index}
          register={register}
          form={form}
          products={products}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}

      <p>Total : {totalPrice}</p>

      <div className="space-x-2">
        <Button
          type="button"
          variant={"ghost"}
          className="cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => append(defaultTransactionItem)}
        >
          <IoMdAddCircle />
        </Button>
        {fields.length > 1 && (
          <Button
            type="button"
            variant={"ghost"}
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => remove(0)}
          >
            <FaTrashAlt />
          </Button>
        )}
      </div>

      <datalist id="product-name-list">
        {productsName.map((prod) => (
          <option value={prod} key={prod} />
        ))}
      </datalist>
    </>
  );
}
