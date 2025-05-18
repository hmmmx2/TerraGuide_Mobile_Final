import React from 'react';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-native-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(faBell);

type Props = {
    name: IconProp;
    size?: number;
    color?: string;
    className?: string;
};

export function FontAwesomeIcon({
                                    name,
                                    size = 24,
                                    color = 'black',
                                    className,
                                    ...rest
                                }: Props) {
    return (
        <FAIcon icon={name} size={size} color={color} {...rest} />
    );
}