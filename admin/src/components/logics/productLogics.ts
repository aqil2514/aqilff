import React, { useState } from "react";

export function useSearchProductLogic() {
  const [name, setName] = useState<string>("");

    const searchNameHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;

        setName(value)
    }

  return { name, searchNameHandler };
}
