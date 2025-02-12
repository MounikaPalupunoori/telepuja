import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  Card,
  CardContent,
  Searchbar,
  ListItem,
  Row,
  Icon,
  Col,
  Button,
  theme
} from 'framework7-react';

const MessagesPage = () => (
  <Page name="messages">
    {/* Top Navbar */}
    <Navbar className="header-bg">
      <NavLeft className="header-img">
        <img src="https://www.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg"></img>
        <span className="header-text">Kalyan</span>
      </NavLeft>
      <NavRight className="header-detail">
        <img src="https://www.pngrepo.com/download/186568/chips-poker-chip.png"></img>
        <span className="header-credits" style={{'marginRight': '8px'}}>150</span>
        <Icon f7="bell_fill"></Icon>
        <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" style={{'color': '#fff'}}/>
      </NavRight>
    </Navbar>
    {/* Toolbar */}
    <Toolbar tabbar tabbar-labels bottom className="custom-tabbar">
      <div className="toolbar-inner">
        <Link className="tab-link tab-outer" iconMd="material:home" href="/home/">
          <span className="tabbar-label" style={{'fontSize': '10px'}}>Home</span>
        </Link>
        <Link className="tab-link tab-outer" iconMd="material:brightness_7" href="/temples/">
          <span className="tabbar-label" style={{'fontSize': '10px'}}>Temples</span>
        </Link>
        <Link className="tab-link tab-outer" iconMd="material:face" href="/purohits/">
          <span className="tabbar-label" style={{'fontSize': '10px'}}>Purohits</span>
        </Link>
        <Link className="tab-link tab-outer tab-link-active" iconMd="f7:chat_bubble_2_fill" href="/messages/">
          <span className="tabbar-label" style={{'fontSize': '10px'}}>Messages</span>
        </Link>
        <Link className="tab-link tab-outer" iconMd="material:assignment_ind" href="/profile/">
          <span className="tabbar-label" style={{'fontSize': '10px'}}>Profile</span>
        </Link>
      </div>
    </Toolbar>
    {/* Page content */}
    <Searchbar
      searchContainer=".search-list"
      searchIn=".item-title"
      disableButton={!theme.aurora}
      placeholder="Search Purohits.."
    ></Searchbar>
    <BlockTitle>Temples</BlockTitle>
    <List className="searchbar-not-found">
      <ListItem title="Nothing found"></ListItem>
    </List>
    <List mediaList className="search-list searchbar-found">
      <ListItem title="Aravind Sharma" subtitle="Draksharamam" link="/chats/">
        <img
          slot="media"
          src="https://cdn.framework7.io/placeholder/fashion-88x88-1.jpg"
          width="44"
        />
      </ListItem>
      <ListItem title="Aanjaneyulu" subtitle="Chinna Tirupathi" link="/chats/">
        <img
          slot="media"
          src="https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg"
          width="44"
        />
      </ListItem>
      <ListItem title="Sravan" subtitle="Antarvedi" link="/chats/">
        <img
          slot="media"
          src="https://cdn.framework7.io/placeholder/fashion-88x88-3.jpg"
          width="44"
        />
      </ListItem>
    </List>
  </Page>
);
export default MessagesPage;