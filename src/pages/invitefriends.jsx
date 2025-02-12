import React, { useState, useEffect } from 'react';
import whatsapp from '../assets/img/iconfinder_1_Whatsapp2_colored_svg_5296520.png';
import facebook from '../assets/img/iconfinder_Colored_Facebook3_svg_5365678.png';
import twitter from '../assets/img/iconfinder_1_Twitter3_colored_svg_5296516.png';
import linkedin from '../assets/img/iconfinder_1_Linkedin_unofficial_colored_svg_5296501.png';
import copytext from '../assets/img/iconfinder_multimedia-32_2849804.png';
import {
    Block,
    Button,
    f7,
    Page,
} from 'framework7-react';
import toastr from 'toastr';
import { getLoggedinUserDetails } from '../utils/api.js';
import { useSelector } from 'react-redux';

const InviteFriendsPage = (props) => {
    const [isOpen, setIsOpen] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [invitefriendsPopup, setInviteFriendsPopup] = useState(false);
    const [ref_id, setrefId] = useState("");
    const userData = useSelector((state => state && state.auth && state.auth.userDetails));

    const handleClose = () => {
        setIsOpen(!isOpen);
    }

    const handleClick = () => {
        navigator.clipboard.writeText('https://telepuja-qa.web.app');
        toastr.success('link copied')
    }

    return (
        <div>
            {isOpen ?
                <div name="services" className="color-deeporange custom-bg popup-box">
                    <div className="box" style={{ maxWidth: '300px' }}>
                        <Block className="display-flex justify-content-space-between">
                            <Button onClick={handleClick}><img src={copytext}></img></Button>
                            <a class='link external' target="_system" href={'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ftelepuja-qa.web.app%2F'+ref_id+'&quote=Hey!%20Iam%20using%20this%20app%20from%20a%20while%20and%20found%20it%20user%20friendly.%20You%20can%20book%20services%2C%20attend%20live%20pujas%20and%20do%20much%20more%20using%20this%20app%20without%20stepping%20out.%0A%0AClick%20this%20link%20and%20signup%20%3A-%0A'}><img src={facebook}></img></a>
                            <a class='link external' target="_system" href={'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Ftelepuja-qa.web.app%2F'+ref_id+'&summary=Hey!%20Iam%20using%20this%20app%20from%20a%20while%20and%20found%20it%20user%20friendly.%20You%20can%20book%20services%2C%20attend%20live%20pujas%20and%20do%20much%20more%20using%20this%20app%20without%20stepping%20out.%20%20Click%20this%20link%20and%20signup%20%3A-%20&source=LinkedIn'}><img src={linkedin}></img></a>
                            <a class='link external' target="_system" href={'https://twitter.com/intent/tweet?url=https%3A%2F%2Ftelepuja-qa.web.app%2F'+ref_id+'&text=Hey!%20Iam%20using%20this%20app%20from%20a%20while%20and%20found%20it%20user%20friendly.%20You%20can%20book%20services%2C%20attend%20live%20pujas%20and%20do%20much%20more%20using%20this%20app%20without%20stepping%20out.%20%20Click%20this%20link%20and%20signup%20%3A-%20'}><img src={twitter}></img></a>
                            <a class='link external' target="_system" href={'https://api.whatsapp.com/send?text=Hey!%20Iam%20using%20this%20app%20from%20a%20while%20and%20found%20it%20user%20friendly.%20You%20can%20book%20services%2C%20attend%20live%20pujas%20and%20do%20much%20more%20using%20this%20app%20without%20stepping%20out.%0A%0AClick%20this%20link%20and%20signup%20%3A-%0Ahttps%3A%2F%2Ftelepuja-qa.web.app%2F' + ref_id}><img src={whatsapp}></img></a>
                        </Block>
                        <Button style={{ 'width': '50%', 'border': '1px solid', margin: 'auto' }}
                            onClick={props.handleClose}>Cancel</Button>
                    </div>
                </div > : null
            }
        </div >

    );
}
export default InviteFriendsPage;