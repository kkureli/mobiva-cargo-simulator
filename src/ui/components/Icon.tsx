import React from 'react';
import List from '../../assets/svg/list.svg';
import Plus from '../../assets/svg/plus.svg';
export type CustomIconName = keyof typeof icons;
interface IconProps {
  name: CustomIconName;
  color?: string;
  stroke?: string;
  size?: number;
}
const icons = {
  ListIcon: List,
  PlusIcon: Plus,
};

const CustomIcon: React.FC<IconProps> = ({ name, size, ...props }) => {
  if (!name) {
    return <></>;
  } else {
    const IconComponent = icons[name];

    if (!IconComponent) {
      // console.log(`Icon "${iconName}" bulunamadı.`);
      return null; // Icon bulunamazsa null döner
    }

    const iconSizes = {};
    if (size) {
      iconSizes.width = size;
      iconSizes.height = size;
    }
    return <IconComponent {...props} {...iconSizes} />;
  }
};

export default CustomIcon;
