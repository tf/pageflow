module Pageflow
  class MembershipPolicy
    class Scope
      include Pageflow::AdmissionPolicyScopeMixin

      private

      def table_name
        'pageflow_memberships'
      end
    end
    include Pageflow::AdmissionPolicyMixin

    private

    def create_admission_for_entry?
      @admission.user.accounts.include?(@admission.entity.account)
    end
  end
end
