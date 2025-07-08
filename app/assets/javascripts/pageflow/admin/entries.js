jQuery(function($) {
  var switchFolderSelect = function() {
    var account = $(this).find('option:selected').text();
    if($('#entry_folder_input :selected').parent().attr('label') !== account) {
      $('option[value=""]').prop('selected', 'selected');
    };
    $('#entry_folder_input').val(0).find('optgroup').each(function(){
      var optgroup_account = this.label,
          isCorrectAccount = (optgroup_account === account);
      $(this).children('option').each(function(){
        var $option = $(this);
        $option.prop('disabled', !isCorrectAccount);
      });
    });
  };

  $('.entry_account_input').change(switchFolderSelect);
  $('.entry_account_input').trigger('change');

  $('.admin_entries').each(function() {
    if ($('#folders_sidebar_section').length) {
      $('#index_table_entries tr').draggable({
        helper: function() {
          var title = $('.title a', this).text();
          return $('<div class="dragged_entry" />').text(title);
        },

        cursorAt: { left: 5, top: 5 },
        distance: 3,
        appendTo: '#wrapper'
      });

      $('#folders_sidebar_section ul.folders > li').droppable({
        tolerance: 'pointer',
        hoverClass: 'drop_over',

        accept: function(draggable) {
          var entryAccountId = $(draggable).find('.col-account a').data('id');
          var folderAccountId = $(this).parents('.accounts > li').data('id');

          return !entryAccountId ||
            entryAccountId == folderAccountId ||
            isAllFolder(this);
        },

        activate: function() {
          $(this).addClass('drop_target');
        },

        deactivate: function() {
          $(this).removeClass('drop_target drop_over');
        },

        drop: function(event, ui) {
          var folderId = $(this).data('id');
          var entryId = $(ui.draggable).attr('id').replace('pageflow_entry_', '');

          $.ajax({
            url: '/admin/entries/' + entryId,
            method: 'put',
            dataType: 'json',
            data: {
              entry: {
                folder_id: folderId || ''
              }
            }
          }).done(function() {
            location.reload();
          });
        }
      });

      if ($('#folders_sidebar_section a.new').length > 0) {
        $('#folders_sidebar_section')
          .append('<a href="#" class="edit_toggle edit" title="Bearbeiten"></a>')
          .append('<a href="#" class="edit_toggle done" title="Fertig"></a>');
      }

      $('#folders_sidebar_section .edit_toggle').on('click', function() {
        $('#folders_sidebar_section').toggleClass('editable');
      });
    }

    function isAllFolder(folder) {
      return $(folder).data('role') === 'all';
    }
  });

  $('.admin_entries form.pageflow_entry').each(function() {
    var accountSelect = $('#entry_account_id', this);
    var siteSelect = $('#entry_site_id', this);
    var titleInput = $('#entry_title', this);
    var allowEmptySlugInput = $('#entry_allow_empty_slug', this);
    var directorySelect = $('#entry_permalink_attributes_directory_id', this);
    var slugInput = $('#entry_permalink_attributes_slug', this);

    function updateSiteAndEntryTypeInput() {
      var selectedAccountId = accountSelect.val();

      $.get('/admin/entries/entry_site_and_type_name_input' +
            '?account_id=' + selectedAccountId +
            '&entry_type_name=' + $('[name="entry[type_name]"]').val())
       .done(function(response) {
         $('#entry_type_name_input').replaceWith($(response).filter('#entry_type_name_input'));
         $('#entry_site_input').replaceWith($(response).filter('#entry_site_input'));

         // Set up searchable select
         $(document).trigger('page:load');

         siteSelect = $('#entry_site_id');
         siteSelect.on('change', updatePermalinkInput);

         updatePermalinkInput();
       });
    }

    function updatePermalinkInput() {
      fetchPermalinkInput(function(response) {
        $('#entry_permalink_attributes_permalink_input').replaceWith(response);
        directorySelect = $('#entry_permalink_attributes_directory_id');
        slugInput = $('#entry_permalink_attributes_slug');
      });
    }

    function updateSlugPlaceholder() {
      fetchPermalinkInput(function(response) {
        $('#entry_permalink_attributes_permalink_input input[placeholder]')
          .attr('placeholder',
                $(response).find('input[placeholder]').attr('placeholder'));
      });
    }

    function fetchPermalinkInput(callback) {
      $.get('/admin/entries/permalink_inputs' +
            '?entry[account_id]=' + accountSelect.val() +
                   (siteSelect.val() ? '&entry[site_id]=' + siteSelect.val() : '') +
            '&entry[title]=' + encodeURIComponent(titleInput.val()))
       .done(callback);
    }

    accountSelect.on('change', updateSiteAndEntryTypeInput);

    accountSelect.on('change', updatePermalinkInput);
    siteSelect.on('change', updatePermalinkInput);

    titleInput.on('change keyup', debounce(updateSlugPlaceholder, 300));

    function enableRootEntry() {
      slugInput.val('').removeAttr('placeholder');
      allowEmptySlugInput.val('1');
      if (directorySelect.length) {
        directorySelect.val($('.root_entry_link').data('root-directory-id'));
      }
    }

    $('.root_entry_link').on('click', function(event) {
      event.preventDefault();
      enableRootEntry();
    });

    if (allowEmptySlugInput.val() === '1') {
      enableRootEntry();
    }
  });
});

function debounce(func, timeout){
  var timer;

  return function() {
    var args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() { func.apply(this, args); }, timeout);
  };
}
