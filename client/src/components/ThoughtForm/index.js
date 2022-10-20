import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
    const [thoughtText, setText] = useState('');

    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought to database
            await addThought({ variables: { thoughtText } });

            // clear textarea field
            setText('');
            setCharacterCount(0);
        } catch(e) {
            console.error(e);
        }

    };

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
            // check me cache exists
            try {
                // update me array's cache
                const { me } = cache.readQuery({ query: QUERY_ME });
                cache.writeQuery({
                    query: QUERY_ME,
                    data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
                });
            } catch (e) {
                console.warn("First thought insertion by user!");
            }

            // update cache for thought array
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

            // add the newest thought to the front of the array
            cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] }
            });
        }
    });

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className='ml-2 text-error'>Something went wrong...</span>}
            </p>
            <form onSubmit={handleFormSubmit}>
                <textarea className='bg-secondary text-light form-input col-12 col-md-9' placeholder="Here's a new thought..." value={thoughtText} onChange={handleChange}></textarea>
                <div>
                    <button className='btn col-12 col-md-3' type='submit'>
                        Submit
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ThoughtForm;