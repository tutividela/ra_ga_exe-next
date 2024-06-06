import { FormControlLabel, FormLabel, Switch as MSwitch } from "@mui/material";
import { Controller } from "react-hook-form";
import { LayoutElement } from "../types";
import { useIsDisabled } from "@utils/useIsDisabled";

export type SwitchProps<Model> = {
  layout: LayoutElement<Model>;
  hasParent?: boolean;
  parentScope?: string;
};

function Switch<Model>(props: SwitchProps<Model>) {
  const { layout } = props;
  const isDisabled = useIsDisabled(layout?.rules || []);

  return (
    <>
      <Controller
        name={layout.scope}
        defaultValue={null}
        rules={{
          required: {
            value: layout?.options?.required,
            message: "Please check this field",
          },
        }}
        render={({
          field: { onChange, value, name, ref },
          fieldState: { invalid },
        }) => {
          return (
            <>
              <FormControlLabel
                className={layout?.className ? layout?.className : "ml-0"}
                control={
                  <MSwitch
                    id={`${name}-switch`}
                    size="medium"
                    disabled={layout?.options?.disabled || isDisabled}
                    required={layout?.options?.required}
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    inputRef={ref}
                  />
                }
                labelPlacement={layout?.options?.labelPlacement || "start"}
                label={
                  (layout?.label ? (
                    <FormLabel
                      error={invalid}
                      required={layout?.options?.required}
                    >
                      {layout?.label}
                    </FormLabel>
                  ) : null) as any
                }
              />
            </>
          );
        }}
      />
    </>
  );
}

export default Switch;
