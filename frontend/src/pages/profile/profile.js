import React from "react";
import { Navigate } from "react-router-dom";
import SessionManager from "../../SessionManager.js";
import "../../App.css";
import "./profile.css";
import * as Axios from "axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: "Loading...",
            creationDate: "Loading...",
            suspects: [],
            redirect: "",
            suspectInfo: "",
            changeMade: false
        }
    }

    componentDidMount = async () => {
        // Get data from token from session manager
        /* 
            {
                token: token,
                suspects: [],
                creationDate: formattedDateString
            }
        */

        let userData = await Axios.post("api/getuser", { token: SessionManager.GetToken() });
        if (!userData.data.success) {
            return this.setState({ redirect: "/" }) // redirect to home if bad token
        }

        this.setState({ token: SessionManager.GetToken(), creationDate: userData.data.creationDate, suspects: userData.data.suspects })
    }

    redirect = () => {
        if (this.state.redirect)
            return <Navigate to={this.state.redirect} />
    }

    renderSuspects = () => {
        let renderData = [];

        this.state.suspects.forEach((suspect, i) => {
            renderData.push(
                <div className="suspectCont" key={i}>
                    <div className="suspectProp">Name: {suspect.name || "Unknown"}</div>
                    <div className="suspectProp">Age: {suspect.age || "Unknown"}</div>
                    <div className="suspectProp">Address: {suspect.address || "Unknown"}</div>
                    <div className="suspectProp">Desc: {suspect.description ? suspect.desription.slice(0, Math.min(30, suspect.description.length)) : "Unknown"}</div>
                    <div className="suspectProp">Date-Reported: {suspect.dateReported}</div>
                    <div className="suspectProp">Id: {suspect.id} </div>
                    <button className="suspectManageBtn" onClick={() => this.setState({ suspectInfo: JSON.parse(JSON.stringify(this.state.suspects.find(s => s.id == suspect.id))) })}>Manage</button>
                </div>
            )
        })

        return renderData;
    }

    addSuspect = async () => {
        let temp = {
            name: "",
            age: "",
            address: "",
            socials: {
                twitter: "",
                instagram: "",
                youtube: ""
            },
            description: "",
            files: [], // <- upload to backend server first, then get urls
        }
        let suspectData = await Axios.post("api/createsuspect", {
            token: SessionManager.GetToken(),
            suspectData: temp
        });
        let d = suspectData.data;
        if (!d.success) {
            this.setState({ redirect: "/" })
        }

        let susId = d.id;
        let susD = d.date;

        temp.id = susId;
        temp.dateReported = susD;
        this.setState({ suspects: [...this.state.suspects, temp] });
    }

    saveSuspect = async () => {
        // update suspect on axios
        let susSave = await Axios.post("api/updatesuspect", { token: SessionManager.GetToken(), data: this.state.suspectInfo });
        if (!susSave.data.success) {
            return this.setState({ redirect: "/" })
        }
        let newSuspects = [...this.state.suspects.filter(s => s.id != this.state.suspectInfo.id), this.state.suspectInfo];
        this.setState({ changeMade: false, suspects: newSuspects, suspectInfo: "" });
    }

    discardChange = () => {
        this.setState({ changeMade: false, suspectInfo: "" })
    }

    renderSaveButtons = () => {
        if (this.state.changeMade) {
            return <div id="btnCont">
                <button className="suspectButton" id="saveBtn" onClick={this.saveSuspect}>Save</button>
                <button className="suspectButton" id="discardBtn" onClick={this.discardChange}>Discard</button>
            </div>
        } else {
            return <div id="btnCont">
                <button className="suspectButton" id="backBtn" onClick={() => this.setState({ suspectInfo: "" })}>Back</button>
            </div>
        }
    }

    render() {
        if (!this.state.suspectInfo) {
            return (
                <React.Fragment>
                    {this.redirect()}
                    <div id="pageWrapper">
                        <div id="profileHeader">
                            <div id="token">{this.state.token}</div>
                            <div id="creationDate">{this.state.creationDate}</div>
                        </div>
                        <div id="profileSuspects">
                            <button id="addSuspectBtn" onClick={this.addSuspect}>Add Suspect</button>
                            {this.renderSuspects()}
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            // Return suspect info component
            return (
                <React.Fragment>
                    {this.redirect()}
                    <div id="pageWrapper">
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Name:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.name} onChange={e => {
                                // update reference
                                this.state.suspectInfo.name = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Age:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.age} onChange={e => {
                                // update reference
                                if (isNaN(e.target.value)) return;

                                this.state.suspectInfo.age = e.target.value ? parseInt(e.target.value) : "";
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Address:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.address} onChange={e => {
                                // update reference
                                this.state.suspectInfo.address = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Desc:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.description} onChange={e => {
                                // update reference
                                this.state.suspectInfo.description = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Twitter:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.socials.twitter} onChange={e => {
                                // update reference
                                this.state.suspectInfo.socials.twitter = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Instagram:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.socials.instagram} onChange={e => {
                                // update reference
                                this.state.suspectInfo.socials.instagram = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoInputCont">
                            <div className="suspectInfoInputDesc">Youtube:</div>
                            <input className="suspectInfoInput" value={this.state.suspectInfo.socials.youtube} onChange={e => {
                                // update reference
                                this.state.suspectInfo.socials.youtube = e.target.value;
                                this.state.changeMade = true;
                                this.forceUpdate();
                            }} />
                        </div>
                        <div className="suspectInfoProp">Date-Reported: {this.state.suspectInfo.dateReported}</div>
                        <div className="suspectInfoProp">Id: {this.state.suspectInfo.id}</div>
                        {this.renderSaveButtons()}
                    </div>
                </React.Fragment>
            )
        }
    }
}