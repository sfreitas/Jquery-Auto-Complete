(function ($) {

    $.fn.AutoComplete = function (options) {
        var defaults = {
            zIndex: "257"
        }

        //Merge the user defined options with the default options
        options = $.extend({}, $.fn.AutoComplete.defaultOptions, options);

        //set global variables
        var m_Textbox = this;
        var m_TimeoutHandle = 1;
        var m_Source = options.source;
        var m_Items = new Array();
        var m_Index = -1;

        //Loop through each element in the DOM selection
        return m_Textbox.each(function () {
            //Keydown Event Listenner
            $(m_Textbox).on("keydown", function (e) {
                var l_CharCode = (e.which) ? e.which : event.keyCode;

                if (l_CharCode != 38 && l_CharCode != 40 & l_CharCode != 13) {
                    if (m_TimeoutHandle) {
                        clearTimeout(m_TimeoutHandle);
                    }

                    //set timeout is needed to create a wait between a user typing and the search method firing
                    m_TimeoutHandle = window.setTimeout(function () { search(); }, 500); 
                }
                else {
                    if (m_Textbox.val() != "") {
                        if (l_CharCode == 38) { //Arrow up was pressed
                            arrowUp();
                        }
                        if (l_CharCode == 40) { //Arrow down was pressed
                             arrowDown();
                        }
                        if (l_CharCode == 13) { //Enter key was pressed, an item will be copied to the input                                                   
                            var l_Option = $("div.Option", "#AutoComplete").eq(m_Index);

                            if (l_Option.length > 0)
                            {
                               selectItem(l_Option.html());                         
                            }
                        }
                    }
                }                               
            })

            //When focus out is triggered the autocomplete will be removed from the Dom
            $(m_Textbox).focusout(function () { window.setTimeout(function () { $("#AutoComplete").remove(); }, 500) });
           
        });

        //this method basically compares the text typed in with the options in the source object,returning the ones that macth
        function search() {
            var l_Regex = new RegExp($(m_Textbox).val(), "i");
            var l_PlaceHolder = $("<div></div>");

            for (var i = 0; i < m_Source.length ; i++) {
                var l_Name = m_Source[i];

                if ((l_Name).match(l_Regex)) {
                    var l_Option = $("<div class='Option'>" + l_Name + "</div>")
                        .click(function () { selectItem($(this).html()); })
                        .mouseout(function () { });

                    l_PlaceHolder.append(l_Option);
                }
            }

            search_complete(l_PlaceHolder);
        }

        //method will append options returned by search() to the autocomplete div
        function search_complete(p_Results) {
            $("#AutoComplete").remove(); //remove any previous AutoComplete added to the page

            if (p_Results.children().length > 0) {
                var l_Position = $(m_Textbox).position(); 
                
                var l_AutoComplete = $("<div id='AutoComplete'></div>").css({"display": "inline", "zIndex": options.zIndex });
                l_AutoComplete.append(p_Results.children());

                $(window.document.body).append(l_AutoComplete);
            }
            else {
            }
        }

        //Method called when an item is selected from the search
        function selectItem(p_Name)
        {            
            var l_Item = $("<div class='Item'>" + p_Name + "</div>");

            var l_SearchArea = m_Textbox.parent();

            $(l_SearchArea).find(m_Textbox).before(l_Item) //insert the clicked item inside the search area

            l_Item.append($("<div class='Icon'></div>")
                            .width("20")
                            .height(l_Item.height() + 4)
                            .append("<img src='AutoComplete/Images/Remove.png'/>")
                            .click(function () { removeItem(this); })
                          );
                        
            $("#AutoComplete").remove(); //remove AutoComplete
          
            m_Items.push(p_Name);

            resizeTextbox();

            m_Textbox.val(""); //clear textbox text
            m_Textbox.focus();

            m_Index = -1; //clear index
        }

        //Method called when an item is removed from the input (by clicking in the remove button)
        //1 - remove item from the input
        //2 - remove item from the global variable m_Items
        function removeItem(p_Icon)
        {
            var l_Icon= $(p_Icon); //remove button
          
            var l_Item = l_Icon.parent();

            l_Icon.remove(); //remove the icon first, so it's easier to get the item text 

            var l_Text = l_Item.text();

            //loop through m_Items to remove the one that matches the text of the item clicked 
            for (var i = 0; i < m_Items.length; i++) {
                var l_Name = m_Items[i];

                if ($.trim(l_Name) == $.trim(l_Text)) {
                    m_Items.splice(i, 1);
                }
            }

            l_Item.remove();

            resizeTextbox();

            m_Textbox.focus();
        }

        //Method used to resize the input to fit in the search area, as options are added the space available for the input is smaller.
        function resizeTextbox()
        {
            var l_SearchArea = m_Textbox.parent();
            var l_Items = $("div.Item", l_SearchArea);

            var l_LastElem = l_Items.eq(l_Items.length - 1); //access the last element in the search area

            var l_SearchAreaW = $(l_SearchArea).width();

            if (l_LastElem.length > 0) {
                var l_Left = l_LastElem.position().left;
                var l_Width = l_LastElem.width();

                m_Textbox.width(l_SearchAreaW - l_Left - l_Width - 2);
                m_Textbox.css("margin-top", "-3px");
            }
            else {
                m_Textbox.css("margin-top", "4px"); //default textbox position back to original
                m_Textbox.width(l_SearchAreaW - 5);
            }
        }
        //Mehtod called when key arrow down is pressed by the user
        function arrowDown()
        {
            var l_Options = $("div.Option", "#AutoComplete");

            if (l_Options.length > 0 && m_Index < l_Options.length - 1) {
                l_Options.eq(m_Index).css("background-color", "");

                m_Index += 1;

                l_Options.eq(m_Index).css("background-color", "#D0D3D6");
            }
        }

        //Mehtod called when key arrow up is pressed by the user
        function arrowUp() {
            var l_Options = $("div.Option", "#AutoComplete");

            if (l_Options.length > 0 && m_Index > 0) {
                l_Options.eq(m_Index).css("background-color", "");

                m_Index -= 1;

                l_Options.eq(m_Index).css("background-color", "#D0D3D6");
            }
        }     
    }
})(jQuery);

