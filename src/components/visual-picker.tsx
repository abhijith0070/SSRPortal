import * as RadioGroup from '@radix-ui/react-radio-group';
import clsx from 'clsx';

type TVisualPicker = {
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[] | string[];
  className?: string;
  label?: string;
  value: string;
  onChange: (e: string) => void;
};

const VisualPicker = ({ options, className = '', label = 'Select an option', value, onChange }: TVisualPicker) => {
  return (
      <div>
          <div className="text-sm font-medium text-gray-900 mb-2">{label}</div>
          <div>
              <RadioGroup.Root 
                  className={clsx(['flex gap-4', className])}
                  aria-label={label}
                  value={value}
              >
                  {options.map((option, index) => (
                      <div
                          className={clsx([
                            value === (typeof option === 'string' ? option : option.value) ? 'bg-primary text-primaryTextColor' : 'text-gray-900 bg-gray-100/50',
                            'flex items-center justify-center p-4 w-32 h-32 border',
                            'rounded-lg cursor-pointer',
                          ])}
                          key={index}
                          onClick={() => onChange(typeof option === 'string' ? option : option.value)}
                      >
                          <label className="Label flex flex-col items-center text-xl gap-2" htmlFor={`r${index}`}>
                              {typeof option === 'object' && option.icon ? option.icon : null}
                              {typeof option === 'string' ? option : option.label}
                          </label>
                      </div>
                  ))}
              </RadioGroup.Root>
          </div>
      </div>
  );
};

export default VisualPicker;