module Dom
  module Admin
    class AccountInIndexTable < Domino
      selector '.admin_accounts.index .index_table tbody tr'

      attribute :name, 'td.col-name'
    end
  end
end
