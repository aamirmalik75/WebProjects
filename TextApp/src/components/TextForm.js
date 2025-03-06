import React, { useState } from 'react';
import propTypes from "prop-types";

export default function TextForm(props) {

    const [text, setText] = useState('Try Me!');

    const textHighlighted = () => {
        return props.colorMode.textHighlightedColor;
    }

    const changeHandler = (e) => {
        setText(e.target.value)
    }

    const ChangeUpCase = () => {
        let newText = text.toUpperCase();
        setText(newText)
        props.showAlert('Converted to UpperCase', 'Success');
    }
    const ChangeLoCase = () => {
        let newText = text.toLowerCase();
        setText(newText)
        props.showAlert('Converted to LowerCase', 'Success');
    }

    const check = (arr, mode) => {
        let lo = 0, up = 0;
        for (let i = 0; i < arr.length; i++) {
            if (text[i] === 'A' || text[i] === 'B' || text[i] === 'C' || text[i] === 'D' || text[i] === 'E' || text[i] === 'F' || text[i] === 'G' || text[i] === 'H' || text[i] === 'I' || text[i] === 'J' || text[i] === 'K' || text[i] === 'L' || text[i] === 'M' || text[i] === 'N' || text[i] === 'O' || text[i] === 'P' || text[i] === 'Q' || text[i] === 'R' || text[i] === 'S' || text[i] === 'T' || text[i] === 'U' || text[i] === 'V' || text[i] === 'W' || text[i] === 'X' || text[i] === 'Y' || text[i] === 'Z') {
                up++;
            }
            else if (text[i] !== ' ') {
                lo++;
            }
        }
        return mode ? up : lo;
    }

    function checkToU() {
        return check(text, 1);
    }
    function checkToL() {
        return check(text, 0);
    }

    function clearText() {
        setText('');
        props.showAlert('Text is Cleared', 'Success');
    }

    const copyText = () => {
        let TextBpx = document.getElementById('TextBpx');
        navigator.clipboard.writeText(TextBpx.value)
        props.showAlert('Copied to Clipboard!', 'Success');
    }

    const extraSpaces = () => {
        setText(text.replace(/\s+/g, " ").trim())
        props.showAlert('Extra Spaces are removed', 'Success');
    }

    return (
        <>
            <div className="textSection">
                <div className="formContainer">
                    <h1 className="TextHeading" style={{ color: props.colorMode.textHeading }}>{props.heading}</h1>
                    <form className='TextForm'>
                        <textarea name="textarea" className='textarea' value={text} id="TextBpx" onChange={changeHandler} rows="10" style={{ backgroundColor: props.colorMode.textareabackgroundColor, color: props.colorMode.textareaColor }}></textarea>
                    </form>
                    <div className="textActions">
                        <button disabled={text.length === 0} className="btn Uppercase" onClick={ChangeUpCase} style={{ backgroundColor: props.colorMode.btnbackgroundColor, color: props.colorMode.btnColor }}>UpperCase</button>
                        <button disabled={text.length === 0} className="btn Lowercase" onClick={ChangeLoCase} style={{ backgroundColor: props.colorMode.btnbackgroundColor, color: props.colorMode.btnColor }}>LowerCase</button>
                        <button disabled={text.length === 0} className="btn clearText" onClick={clearText} style={{ backgroundColor: props.colorMode.btnbackgroundColor, color: props.colorMode.btnColor }}>Clear</button>
                        <button disabled={text.length === 0} className="btn copyText" onClick={copyText} style={{ backgroundColor: props.colorMode.btnbackgroundColor, color: props.colorMode.btnColor }}>Copy</button>
                        <button disabled={text.length === 0} className="btn copyText" onClick={extraSpaces} style={{ backgroundColor: props.colorMode.btnbackgroundColor, color: props.colorMode.btnColor }}>Remove Extra Spaces</button>
                    </div>
                </div>

                <div className='textInfo' style={{ backgroundColor: props.colorMode.textInfobackgroundColor, color: props.colorMode.textInfoColor }}>
                    <h2 className="TextSummary">Your Text Summary</h2>
                    <div className="wordsChar">
                        <p className='para wC'><span className='textHighlighted' style={{ color: textHighlighted() }}>{text.split(/\s+/).filter((element) => { return element.length !== 0 }).length}</span> Words and <span className='textHighlighted' style={{ color: textHighlighted() }}>{text.length}</span> Characters</p>
                        <p className="para MinutesRead"><span className='textHighlighted' style={{ color: textHighlighted() }}>{0.008 * text.split(/\s+/).filter((element) => { return element.length !== 0 }).length}</span> Minutes to read</p>
                        <p className="para counterText"><span className='textHighlighted' style={{ color: textHighlighted() }}>{checkToL()}</span> LowerCase &nbsp; and &nbsp; <span className='textHighlighted' style={{ color: textHighlighted() }}>{checkToU()}</span> UpperCase</p>

                        <h3>Preview</h3>
                        <p className="para">{text.length > 0 ? text : 'Nothing to Preview'}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

TextForm.propTypes = {
    heading: propTypes.string,
}

TextForm.defaultProps = {
    heading: "{Enter Heading}"
}