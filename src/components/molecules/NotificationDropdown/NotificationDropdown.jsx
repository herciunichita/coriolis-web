/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// @flow

import React from 'react'
import { observer } from 'mobx-react'
import styled, { css } from 'styled-components'

import Palette from '../../styleUtils/Palette'
import StyleProps from '../../styleUtils/StyleProps'
import type { NotificationItemData } from '../../../types/NotificationItem'
import StatusIcon from '../../atoms/StatusIcon'

import bellImage from './images/bell'
import loadingImage from './images/loading'

const Wrapper = styled.div`
  cursor: pointer;
  position: relative;
`
const Icon = styled.div`
  position: relative;
  transition: all ${StyleProps.animations.swift};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`
const BellIcon = styled.div`
  width: 12px;
  height: 17px;
`
const bellBadgePostion = css`
  position: absolute;
  top: 6px;
  right: 9px;
`
const Badge = styled.div`
  ${props => props.isBellBadge ? bellBadgePostion : ''}
  background: ${Palette.primary};
  border-radius: 50%;
  width: 6px;
  height: 6px;
  text-align: center;
`
const List = styled.div`
  cursor: pointer;
  background: ${Palette.grayscale[1]};
  border-radius: ${StyleProps.borderRadius};
  width: 272px;
  position: absolute;
  right: 0;
  top: 45px;
  z-index: 10;
`
const ListItem = styled.a`
  display: flex;
  border-bottom: 1px solid ${Palette.grayscale[0]};
  padding: 8px;
  transition: all ${StyleProps.animations.swift};
  justify-content: space-between;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: ${Palette.grayscale[0]};
  }

  &:first-child {
    position: relative;
    border-top-left-radius: ${StyleProps.borderRadius};
    border-top-right-radius: ${StyleProps.borderRadius};

    &:hover:after {
      background: ${Palette.grayscale[0]};
      border-color: transparent transparent ${Palette.grayscale[0]} ${Palette.grayscale[0]};
    }

    &:after {
      content: ' ';
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${Palette.grayscale[1]};
      border: 1px solid ${Palette.grayscale[1]};
      border-color: transparent transparent ${Palette.grayscale[1]} ${Palette.grayscale[1]};
      transform: rotate(135deg);
      right: 10px;
      top: -6px;
      transition: all ${StyleProps.animations.swift};
    }
  }

  &:last-child {
    border-color: transparent;
    border-bottom-left-radius: ${StyleProps.borderRadius};
    border-bottom-right-radius: ${StyleProps.borderRadius};
  }
`
const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
`
const BadgeColumn = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
`
const MainItemInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: -8px;

  & > div {
    margin-right: 8px;
  }
`
const ItemReplicaBadge = styled.div`
  background: 'white';
  color: #7F8795;
  font-size: 9px;
  ${StyleProps.exactWidth('13px')}
  ${StyleProps.exactHeight('10px')}
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  border-radius: 2px;
  border: 1px solid #7F8795;
`
const ItemTitle = styled.div``
const ItemDescription = styled.div`
  color: ${Palette.grayscale[5]};
  font-size: 10px;
  margin-top: 8px;
`
const NoItems = styled.div`
  text-align: center;
  width: 100%;
`
const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  animation: rotate 3s linear infinite;
  @keyframes rotate {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
`

type Props = {
  white?: boolean,
  items: NotificationItemData[],
  onClose: () => void,
}
type State = {
  showDropdownList: boolean,
}
@observer
class NotificationDropdown extends React.Component<Props, State> {
  itemMouseDown: boolean

  constructor() {
    super()

    // $FlowIssue
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  state = {
    showDropdownList: false,
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false)
  }

  handleItemClick() {
    this.setState({ showDropdownList: false })
    this.props.onClose()
  }

  handlePageClick() {
    if (!this.itemMouseDown) {
      if (this.state.showDropdownList) {
        this.props.onClose()
      }
      this.setState({ showDropdownList: false })
    }
  }

  handleButtonClick() {
    if (this.state.showDropdownList) {
      this.props.onClose()
    }

    this.setState({ showDropdownList: !this.state.showDropdownList })
  }

  renderNoItems() {
    if (!this.state.showDropdownList || (this.props.items && this.props.items.length > 0)) {
      return null
    }

    return (
      <List>
        <ListItem
          onMouseDown={() => { this.itemMouseDown = true }}
          onMouseUp={() => { this.itemMouseDown = false }}
        >
          <NoItems data-test-id="notificationDropdown-noItems">There are no notifications</NoItems>
        </ListItem>
      </List>
    )
  }

  renderList() {
    if (!this.state.showDropdownList || !this.props.items || this.props.items.length === 0) {
      return null
    }

    let list = (
      <List>
        {this.props.items.map(item => {
          let executionsHref = item.status === 'RUNNING' ? item.type === 'replica' ? '/executions' : item.type === 'migration' ? '/tasks' : '' : ''

          return (
            <ListItem
              key={item.id}
              onMouseDown={() => { this.itemMouseDown = true }}
              onMouseUp={() => { this.itemMouseDown = false }}
              onClick={() => { this.handleItemClick() }}
              href={`/#/${item.type}${executionsHref}/${item.id}`}
            >
              <InfoColumn>
                <MainItemInfo>
                  <StatusIcon status={item.status} hollow />
                  <ItemReplicaBadge type={item.type}>{item.type === 'replica' ? 'RE' : 'MI'}</ItemReplicaBadge>
                  <ItemTitle>{item.name}</ItemTitle>
                </MainItemInfo>
                <ItemDescription>{item.description}</ItemDescription>
              </InfoColumn>
              {item.unseen ? <BadgeColumn><Badge /></BadgeColumn> : null}
            </ListItem>
          )
        })}
      </List>
    )

    return list
  }
  renderBell() {
    let isLoading = Boolean(this.props.items.find(i => i.status === 'RUNNING'))

    return (
      <Icon
        data-test-id="notificationDropdown-button"
        onMouseDown={() => { this.itemMouseDown = true }}
        onMouseUp={() => { this.itemMouseDown = false }}
        onClick={() => this.handleButtonClick()}
      >
        <BellIcon
          dangerouslySetInnerHTML={{ __html: bellImage(this.props.white ? 'white' : Palette.grayscale[2]) }}
        />
        {this.props.items.find(i => i.unseen) ? <Badge isBellBadge /> : null}
        {isLoading ? <Loading
          dangerouslySetInnerHTML={{ __html: loadingImage(this.props.white) }}
        /> : null}
      </Icon>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderBell()}
        {this.renderList()}
        {this.renderNoItems()}
      </Wrapper>
    )
  }
}

export default NotificationDropdown
