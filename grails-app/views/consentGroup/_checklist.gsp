<g:form controller="consentGroup" action="updateChecklist">
    <g:hiddenField name="id" value="${issue.projectKey}"/>
    <div class="form-group">

        <g:set var="answerKeys" value="${checklistAnswers?.collectEntries({ [it.questionId, it.value] })}"/>
        <g:if test="${checklistAnswers && checklistAnswers.size() > 0}">
            <g:set var="mostRecent" value="${checklistAnswers?.sort({it.updateDate})?.last()}"/>
        </g:if>
        <g:set var="val_1"  value="${answerKeys?.get("q1")}"/>
        <g:set var="val_2"  value="${answerKeys?.get("q2")}"/>
        <g:set var="val_3"  value="${answerKeys?.get("q3")}"/>
        <g:set var="val_4A" value="${answerKeys?.get("q4A")}"/>
        <g:set var="val_4B" value="${answerKeys?.get("q4B")}"/>
        <g:set var="val_5"  value="${answerKeys?.get("q5")}"/>
        <g:set var="val_6A" value="${answerKeys?.get("q6A")}"/>
        <g:set var="val_6B" value="${answerKeys?.get("q6B")}"/>
        <g:set var="val_6C" value="${answerKeys?.get("q6C")}"/>

        <div>
            <ol>

                <li>
                    Does the consent state that future research use must be approved by an IRB/EC?  (If yes, clarify which IRB/EC, and redirect as needed.)
                    <ul style="list-style: none;">
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_13" value="option1" name="q1"
                                       <g:if test="${val_1?.equals("option1")}">checked</g:if>/> Yes
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_14" value="option2" name="q1"
                                       <g:if test="${val_1?.equals("option2")}">checked</g:if>/> No
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_15" value="option3" name="q1"
                                       <g:if test="${val_1?.equals("option3")}">checked</g:if>/> N/A
                            </label>
                        </li>
                        <li class="radio form-inline">
                            <label style="width: 100%;">Comment:
                                <input type="text" class="form-control"
                                       value="${checklistAnswers?.find { it.questionId?.equals("q1_comment") }?.value}"
                                       name="q1_comment" style="width: 50%;">
                            </label>
                        </li>
                    </ul>
                </li>

                <li>
                    Does the consent reference a patient information sheet, or is there reason to believe that one exists? (If yes, request a copy and defer approval.)
                    <ul style="list-style: none;">
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_16" value="option1" name="q2"
                                       <g:if test="${val_2?.equals("option1")}">checked</g:if>/> Yes
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_17" value="option2" name="q2"
                                       <g:if test="${val_2?.equals("option2")}">checked</g:if>/> No
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_18" value="option3" name="q2"
                                       <g:if test="${val_2?.equals("option3")}">checked</g:if>/> N/A
                            </label>
                        </li>
                        <li class="radio form-inline">
                            <label style="width: 100%;">Comment:
                                <input type="text" class="form-control"
                                       value="${checklistAnswers?.find { it.questionId?.equals("q2_comment") }?.value}"
                                       name="q2_comment" style="width: 50%;">
                            </label>
                        </li>
                    </ul>
                </li>

                <li>
                    Does the consent form reference genetic research? (If no, defer approval until reviewed with Chief Compliance Officer.)
                    <ul style="list-style: none;">
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_19" value="option1" name="q3"
                                       <g:if test="${val_3?.equals("option1")}">checked</g:if>/> Yes
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_20" value="option2" name="q3"
                                       <g:if test="${val_3?.equals("option2")}">checked</g:if>/> No
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_21" value="option3" name="q3"
                                       <g:if test="${val_3?.equals("option3")}">checked</g:if>/> N/A
                            </label>
                        </li>
                        <li class="radio form-inline">
                            <label style="width: 100%;">Comment:
                                <input type="text" class="form-control"
                                       value="${checklistAnswers?.find { it.questionId?.equals("q3_comment") }?.value}"
                                       name="q3_comment" style="width: 50%;">
                            </label>
                        </li>
                    </ul>
                </li>

                <li>
                    Does the consent preclude:
                    <ul style="list-style: lower-alpha;">
                        <li>
                            Data/sample sharing outside of the original collection site? (If yes, additional correspondence from sample source or IRB may be necessary.)
                            <ul style="list-style: none;">
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_22" value="option1" name="q4A"
                                               <g:if test="${val_4A?.equals("option1")}">checked</g:if>/> Yes
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_23" value="option2" name="q4A"
                                               <g:if test="${val_4A?.equals("option2")}">checked</g:if>/> No
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_24" value="option3" name="q4A"
                                               <g:if test="${val_4A?.equals("option3")}">checked</g:if>/> N/A
                                    </label>
                                </li>
                                <li class="radio form-inline">
                                    <label style="width: 100%;">Comment:
                                        <input type="text"
                                               class="form-control"
                                               value="${checklistAnswers?.find { it.questionId?.equals("q4A_comment") }?.value}"
                                               name="q4A_comment"
                                               style="width: 50%;">
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li>
                            Commercial Collaborations?
                            <ul style="list-style: none;">
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_25" value="option1" name="q4B"
                                               <g:if test="${val_4B?.equals("option1")}">checked</g:if>/> Yes
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_26" value="option2" name="q4B"
                                               <g:if test="${val_4B?.equals("option2")}">checked</g:if>/> No
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_27" value="option3" name="q4B"
                                               <g:if test="${val_4B?.equals("option3")}">checked</g:if>/> N/A
                                    </label>
                                </li>
                                <li class="radio form-inline">
                                    <label style="width: 100%;">Comment:
                                        <input type="text"
                                               class="form-control"
                                               value="${checklistAnswers?.find { it.questionId?.equals("q4B_comment") }?.value}"
                                               name="q4B_comment"
                                               style="width: 50%;">
                                    </label>
                                </li>
                            </ul>

                        </li>
                    </ul>
                </li>

                <li>
                    Does the research described in the consent form focus on stigmatizing illnesses or vulnerable populations?  (If yes, discuss at ORSP meeting.  May require IRB review.)
                    <ul style="list-style: none;">
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_28" value="option1" name="q5"
                                       <g:if test="${val_5?.equals("option1")}">checked</g:if>/> Yes
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_29" value="option2" name="q5"
                                       <g:if test="${val_5?.equals("option2")}">checked</g:if>/> No
                            </label>
                        </li>
                        <li class="radio">
                            <label>
                                <input type="radio" id="radio_30" value="option3" name="q5"
                                       <g:if test="${val_5?.equals("option3")}">checked</g:if>/> N/A
                            </label>
                        </li>
                        <li class="radio form-inline">
                            <label style="width: 100%;">Comment:
                                <input type="text"
                                       class="form-control"
                                       value="${checklistAnswers?.find { it.questionId?.equals("q5_comment") }?.value}"
                                       name="q5_comment"
                                       style="width: 50%;">
                            </label>
                        </li>
                    </ul>
                </li>


                <li>
                    If applicant has indicated that dbGaP deposition is planned (due to funding or publisher requirements), and that sample collection will take place after January 25, 2015, does the consent reference:
                    <ul style="list-style: lower-alpha;">
                        <li>
                            Future research use?
                            <ul style="list-style: none;">
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_34" value="option1" name="q6A"
                                               <g:if test="${val_6A?.equals("option1")}">checked</g:if>/> Yes
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_35" value="option2" name="q6A"
                                               <g:if test="${val_6A?.equals("option2")}">checked</g:if>/> No
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_36" value="option3" name="q6A"
                                               <g:if test="${val_6A?.equals("option3")}">checked</g:if>/> Unclear
                                    </label>
                                </li>
                                <li class="radio form-inline">
                                    <label style="width: 100%;">Comment:
                                        <input type="text"
                                               class="form-control"
                                               value="${checklistAnswers?.find {
                                                   it.questionId?.equals("q6A_comment")
                                               }?.value}"
                                               name="q6A_comment"
                                               style="width: 50%;">
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li>
                            Broad sharing?
                            <ul style="list-style: none;">
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_37" value="option1" name="q6B"
                                               <g:if test="${val_6B?.equals("option1")}">checked</g:if>/> Yes
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_38" value="option2" name="q6B"
                                               <g:if test="${val_6B?.equals("option2")}">checked</g:if>/> No
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_39" value="option3" name="q6B"
                                               <g:if test="${val_6B?.equals("option3")}">checked</g:if>/> Unclear
                                    </label>
                                </li>
                                <li class="radio form-inline">
                                    <label style="width: 100%;">Comment:
                                        <input type="text"
                                               class="form-control"
                                               value="${checklistAnswers?.find {
                                                   it.questionId?.equals("q6B_comment")
                                               }?.value}"
                                               name="q6B_comment"
                                               style="width: 50%;">
                                    </label>
                                </li>
                            </ul>
                        </li>
                        <li>
                            Whether individual-level data will be shared through an unrestricted or controlled access database?
                            <ul style="list-style: none;">
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_40" value="option1" name="q6C"> Yes
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_41" value="option2" name="q6C"> No
                                    </label>
                                </li>
                                <li class="radio">
                                    <label>
                                        <input type="radio" id="radio_42" value="option3" name="q6C"> Unclear
                                    </label>
                                </li>
                                <li class="radio form-inline">
                                    <label style="width: 100%;">Comment:
                                        <input type="text"
                                               class="form-control"
                                               value="${checklistAnswers?.find {
                                                   it.questionId?.equals("q6C_comment")
                                               }?.value}"
                                               name="q6C_comment"
                                               style="width: 50%;">
                                    </label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    If the answers to a, b, or c are "no" or "unclear," may need to contact IRB/EC and/or NIH to
                    determine whether data is eligible for deposition, or to request exemption from NIH Genomic Data
                    Sharing Policy.
                </li>

            </ol>
        </div>

        <div>
            <p>Reviewer: ${mostRecent?.reviewer}</p>

            <p>Review Date: <g:if test="${mostRecent && mostRecent.updateDate}"><g:formatDate style="LONG" timeStyle="SHORT" date="${mostRecent.updateDate}" /></g:if></p>

            <p>Comments:
                <label>
                    <textarea class="form-control editor" rows="3" name="q7_comment">
                        ${checklistAnswers?.find { it.questionId?.equals("q7_comment") }?.value}
                    </textarea>
                </label>
            </p>

            <p>
                <g:submitButton id="Save" name="Save" value="Save" class="btn btn-primary"/>
            </p>
        </div>

    </div>

</g:form>
