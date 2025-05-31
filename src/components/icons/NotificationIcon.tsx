import React from 'react';
import { FontAwesomeIcon } from './FontAwesomeIcon';

type Props = {
    size?: number;
    color?: string;
};

export function NotificationIcon({
                                     size = 24,
                                     color = 'black',
                                 }: Props) {
    return (
        <FontAwesomeIcon name="bell" size={size} color={color}/>
    );
}
