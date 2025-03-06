import React from 'react'
import { FaAngleDown } from 'react-icons/fa'

export default function About(props) {

    const drop = (e) => {
        const dropDown = document.querySelector(`.dropDown-${e.target.classList[0]}`)
        if (dropDown.nextSibling.hasAttribute('hidden')) {
            dropDown.nextSibling.removeAttribute('hidden');
            dropDown.lastElementChild.style.transform = 'rotate(180deg)';
        }
        else {
            dropDown.nextSibling.setAttribute('hidden', true);
            dropDown.lastElementChild.removeAttribute('style');
        }
    }

    return (
        <div className='aboutContainer' style={{ color: props.colorMode.aboutColor, backgroundColor: props.colorMode.aboutBackground }}>
            <h3 className='aboutTitle'>About Us</h3>

            <div className="1 dropDown  dropDown-1" style={{ borderColor: props.colorMode.aboutColor }} onClick={drop}>
                <h4 className='1'>Easy to Use</h4>
                <FaAngleDown className='1 icon downIcon' />
            </div>
            <div className="section section-1" hidden={true}>
                <p className='aboutText'>TextScanner utility is easy to use. You can easily manipulate your text by given tool.</p>
            </div>

            <div className="2 dropDown  dropDown-2" style={{ borderColor: props.colorMode.aboutColor }} onClick={drop}>
                <h4 className='2'>Facilities</h4>
                <FaAngleDown className='2 icon downIcon' />
            </div>
            <div className="section section-2" hidden={true}>
                <p className='aboutText'>TextScanner utility provide you tools like convert to UpperCase , LowerCase your text, count characters and word in your text, also count number of Uppercase and LowerCase characters and also tell how much time do you require to read your text.</p>
            </div>

            <div className="3 dropDown  dropDown-3" style={{ borderColor: props.colorMode.aboutColor }} onClick={drop}>
                <h4 className='3'>Rate Us</h4>
                <FaAngleDown className='3 icon downIcon' />

            </div>
            <div className="section section-3" hidden={true}>
                <p className='aboutText'>Use it effeciently and rate our app according to your experience.</p>
            </div>
        </div>
    )
}
