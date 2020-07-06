import React from 'react'
import Moment from 'react-moment'
import styles from './Item.module.scss'
import Dotdotdot from 'react-dotdotdot'

const Item = ({
    item
}: {
    item: {
        url: string
        status: string
        lastUpdate: Date
    }
}) => (
    <li>
        <span className={styles.linkUrl} title={item.url}>
            <Dotdotdot clamp={2}>{item.url}</Dotdotdot>
        </span>
        <div className={styles.details}>
            <span>Status: {item.status}</span>
            <span>
                Last update:{' '}
                <Moment date={item.lastUpdate} format="L LTS" interval={0} />
            </span>
            <span />
        </div>
    </li>
)

export default Item
